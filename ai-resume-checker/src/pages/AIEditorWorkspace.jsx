import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Upload, Sparkles, CheckCircle2, History, Download, X, FileText, File as FileIcon } from 'lucide-react';
import { aiEditorService } from '../services/aiEditorService';
import toast from 'react-hot-toast';
import { Document, Page, pdfjs } from 'react-pdf';
import * as docx from 'docx-preview';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function AIEditorWorkspace() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('upload'); // 'upload', 'analyzing', 'workspace'
  
  // Document Data
  const [pages, setPages] = useState([]);
  const [atsReport, setAtsReport] = useState(null);
  
  // Copilot State
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]); // [{ block_id, original, improved, reason, status: 'pending'|'accepted'|'rejected' }]
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);
  
  // Accumulated applied edits for backend processing
  const [appliedEdits, setAppliedEdits] = useState([]);
  
  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      toast.error('Please upload a PDF or DOCX file.');
      return;
    }
    
    setFile(selectedFile);
    setFileUrl(URL.createObjectURL(selectedFile));
    setLoading(true);
    setStep('analyzing');
    
    try {
      const uploadRes = await aiEditorService.uploadResume(selectedFile);
      setPages(uploadRes.pages || []);
      
      // We can also analyze the full text for ATS
      if (uploadRes.text) {
        const analysisRes = await aiEditorService.analyzeResume(uploadRes.text);
        setAtsReport(analysisRes);
      }
      
      setStep('workspace');
    } catch (error) {
      console.error(error);
      toast.error('Failed to parse or analyze resume.');
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  const handleAskCopilot = async () => {
    if (isCopilotThinking) return;
    setIsCopilotThinking(true);
    
    try {
      // Gather all blocks
      const allBlocks = pages.flatMap(p => p.blocks);
      
      // We can only send a subset of blocks if the document is huge, but let's send all for now
      const res = await aiEditorService.suggestEdits(allBlocks, prompt);
      
      if (res.edits && res.edits.length > 0) {
        const newSuggestions = res.edits.map(e => ({ ...e, status: 'pending' }));
        setSuggestions(newSuggestions);
        toast.success(`Copilot found ${newSuggestions.length} improvements!`);
      } else {
        toast('Copilot thought it was already perfect!', { icon: '👏' });
      }
      setPrompt('');
    } catch (error) {
      toast.error('Failed to get suggestions from Copilot.');
    } finally {
      setIsCopilotThinking(false);
    }
  };

  const handleAutoImprove = async () => {
    if (isCopilotThinking) return;
    setIsCopilotThinking(true);
    
    try {
      const allBlocks = pages.flatMap(p => p.blocks);
      const res = await aiEditorService.suggestEdits(allBlocks, null); // null prompt means auto improve
      
      if (res.edits && res.edits.length > 0) {
        const newSuggestions = res.edits.map(e => ({ ...e, status: 'pending' }));
        setSuggestions(newSuggestions);
        toast.success(`Copilot found ${newSuggestions.length} improvements!`);
      } else {
        toast('Copilot thought it was already perfect!', { icon: '👏' });
      }
    } catch (error) {
      toast.error('Failed to auto-improve resume.');
    } finally {
      setIsCopilotThinking(false);
    }
  };

  const acceptSuggestion = async (index) => {
    const updated = [...suggestions];
    updated[index].status = 'accepted';
    setSuggestions(updated);
    
    // Add to applied edits list for backend processing
    const suggestion = updated[index];
    
    // Find the page number and bbox for the block_id
    let editPageNum = 0;
    let editBbox = null;
    let editSize = 12;
    for (const page of pages) {
      const block = page.blocks.find(b => b.block_id === suggestion.block_id);
      if (block) {
        editPageNum = page.page_num;
        editBbox = block.bbox;
        editSize = block.size || 12;
        break;
      }
    }
    
    const newAppliedEdits = [...appliedEdits, { ...suggestion, page_num: editPageNum, bbox: editBbox, size: editSize }];
    setAppliedEdits(newAppliedEdits);
    
    // Visual Round-Trip for immediate feedback
    try {
        const toastId = toast.loading('Updating preview...');
        const newFileBlob = await aiEditorService.applyEdits(file, newAppliedEdits);
        
        // Convert Blob to a File object so the viewer can use it
        const newFile = new File([newFileBlob], file.name, { type: file.type });
        setFile(newFile);
        setFileUrl(URL.createObjectURL(newFileBlob));
        toast.dismiss(toastId);
        
        // If it's a DOCX, re-render it explicitly
        if (newFile.name.endsWith('.docx')) {
            const container = document.getElementById('docx-container');
            if (container) {
                container.innerHTML = ''; // clear old
                import('docx-preview').then(docx => {
                    docx.renderAsync(newFileBlob, container, null, {
                        inWrapper: false,
                        ignoreWidth: false,
                        ignoreHeight: false,
                        ignoreFonts: false,
                        breakPages: true,
                    }).catch(e => console.error("DOCX Render Error:", e));
                });
            }
        }
    } catch(e) {
        console.error("Failed to update visual preview", e);
    }
  };

  const rejectSuggestion = (index) => {
    const updated = [...suggestions];
    updated[index].status = 'rejected';
    setSuggestions(updated);
  };

  const handleExport = async () => {
    if (appliedEdits.length === 0) {
        // If no edits, just download original
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `exported_${file.name}`;
        a.click();
        return;
    }
    
    const toastId = toast.loading('Applying changes and generating your document...');
    try {
        const blob = await aiEditorService.applyEdits(file, appliedEdits);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `improved_${file.name}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Document exported successfully!', { id: toastId });
    } catch (e) {
        console.error(e);
        toast.error('Failed to export document.', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20">
              <Sparkles className="text-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Copilot Resume Editor</h1>
              <p className="text-muted">Layout-preserving AI document editor</p>
            </div>
          </div>
          {step === 'workspace' && (
            <div className="flex gap-3">
              <button onClick={handleExport} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl hover:shadow-lg transition-all hover:scale-105 text-foreground font-bold">
                <Download size={18} /> Export Document
              </button>
            </div>
          )}
        </div>

        {step === 'upload' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-3xl p-12 bg-overlay backdrop-blur-sm">
            <div className="w-20 h-20 rounded-full bg-accent-blue/20 flex items-center justify-center mb-6">
              <Upload size={32} className="text-accent-blue" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Upload your Resume</h2>
            <p className="text-muted mb-8 text-center max-w-md">Upload your existing PDF or DOCX resume. Our AI will analyze it and prepare your editing workspace while preserving your original layout perfectly.</p>
            <label className="cursor-pointer px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-foreground font-bold rounded-xl shadow-lg hover:shadow-accent-blue/40 transition-all hover:scale-105">
              Select Document
              <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleUpload} />
            </label>
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
              <div className="absolute inset-0 border-4 border-accent-blue/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
              <Bot size={32} className="text-accent-blue" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Analyzing Document Structure</h2>
            <p className="text-muted">Extracting bounding boxes, mapping fonts, and preserving layout...</p>
          </motion.div>
        )}

        {step === 'workspace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
            
            {/* Left Panel: Visual Document Viewer */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
              <div className="glass-card rounded-2xl p-4 border border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <FileIcon className="text-accent-blue" size={20} />
                  {file?.name}
                </div>
                <div className="text-xs px-3 py-1 rounded-full bg-overlay-hover text-muted">
                  {appliedEdits.length} edits applied
                </div>
              </div>

              <div className="bg-[#525659] rounded-2xl flex-1 relative overflow-y-auto overflow-x-hidden flex justify-center py-8 shadow-inner custom-scrollbar h-[750px]">
                {file?.name.endsWith('.pdf') ? (
                    <Document file={fileUrl} className="flex flex-col gap-8 shadow-2xl">
                        {pages.map((p, i) => (
                            <div key={i} className="relative group">
                                <Page pageNumber={i + 1} renderTextLayer={true} renderAnnotationLayer={true} width={800} />
                                
                                {/* Overlay Bounding Boxes for Visual Feedback */}
                                {p.blocks.map((block) => {
                                    // Scale coordinates. PyMuPDF coords are usually 72dpi.
                                    // React-pdf renders at a specific width (800).
                                    // We need the original PDF width to scale correctly.
                                    const scaleX = 800 / p.width;
                                    const scaleY = 800 / p.width; // Uniform scaling
                                    
                                    // Check if this block has pending or accepted suggestions
                                    const suggestion = suggestions.find(s => s.block_id === block.block_id);
                                    let borderColor = 'border-transparent';
                                    let bgColor = 'bg-transparent';
                                    
                                    if (suggestion) {
                                        if (suggestion.status === 'pending') {
                                            borderColor = 'border-accent-purple';
                                            bgColor = 'bg-accent-purple/10';
                                        } else if (suggestion.status === 'accepted') {
                                            borderColor = 'border-green-500';
                                            bgColor = 'bg-green-500/10';
                                        }
                                    }

                                    return (
                                        <div 
                                            key={block.block_id}
                                            className={`absolute border-2 ${borderColor} ${bgColor} rounded cursor-pointer transition-colors hover:bg-white/20 hover:border-white/50`}
                                            style={{
                                                left: block.bbox[0] * scaleX,
                                                top: block.bbox[1] * scaleY,
                                                width: (block.bbox[2] - block.bbox[0]) * scaleX,
                                                height: (block.bbox[3] - block.bbox[1]) * scaleY
                                            }}
                                            onClick={() => setPrompt(`Improve this specific section: "${block.text.substring(0, 30)}..."`)}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </Document>
                ) : (
                    <div className="bg-white w-[800px] min-h-[1056px] shadow-2xl p-4 text-black font-sans relative"
                         onClick={(e) => {
                             // Allow user to click any text inside the DOCX rendering to select it for the prompt
                             const text = e.target.innerText;
                             if (text && text.trim().length > 5) {
                                 setPrompt(`Improve this specific section: "${text.substring(0, 40).trim()}..."`);
                             }
                         }}>
                        
                        <div id="docx-container" ref={(el) => {
                            if (el && file && file.name.endsWith('.docx')) {
                                // Only render once to avoid flickering
                                if (!el.hasChildNodes()) {
                                    docx.renderAsync(file, el, null, {
                                        inWrapper: false,
                                        ignoreWidth: false,
                                        ignoreHeight: false,
                                        ignoreFonts: false,
                                        breakPages: true,
                                    }).catch(e => console.error("DOCX Render Error:", e));
                                }
                            }
                        }}>
                        </div>
                    </div>
                )}
              </div>
            </div>

            {/* Right Panel: Copilot Sidebar */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              
              {/* Copilot Chat Box */}
              <div className="glass-card rounded-2xl p-6 border border-border flex flex-col relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-purple/20 blur-3xl rounded-full"></div>
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2 relative z-10">
                  <Bot className="text-accent-purple" /> Copilot Chat
                </h3>
                <p className="text-sm text-muted mb-4 relative z-10">Ask me to rewrite sections, improve keywords, or fix grammar. I will suggest edits without changing your layout.</p>
                
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="e.g., 'Make my Java project bullet points sound more impactful for Google', 'Fix all grammar issues'"
                  className="w-full h-32 bg-black/40 border border-border rounded-xl p-4 text-foreground focus:outline-none focus:border-accent-purple resize-none mb-4 relative z-10"
                />
                
                <div className="flex gap-3 relative z-10">
                  <button 
                    onClick={handleAutoImprove}
                    disabled={isCopilotThinking}
                    className="flex-1 py-3 bg-overlay-hover hover:bg-white/20 border border-border rounded-xl text-foreground font-bold transition-all disabled:opacity-50 text-sm"
                  >
                    Auto Improve All
                  </button>
                  <button 
                    onClick={handleAskCopilot}
                    disabled={isCopilotThinking || !prompt.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-foreground rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg hover:shadow-accent-purple/40 text-sm"
                  >
                    {isCopilotThinking ? 'Thinking...' : 'Ask Copilot'}
                  </button>
                </div>
              </div>

              {/* Suggestions List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                <h3 className="text-foreground font-bold sticky top-0 bg-primary py-2 z-10">Review Suggestions ({suggestions.filter(s => s.status === 'pending').length})</h3>
                
                <AnimatePresence>
                  {suggestions.map((suggestion, index) => {
                    if (suggestion.status !== 'pending') return null;
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={index} 
                        className="bg-overlay border border-accent-purple/30 rounded-xl p-4 flex flex-col gap-3 backdrop-blur-md"
                      >
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-xs font-bold text-accent-purple uppercase tracking-wider">{suggestion.reason}</span>
                        </div>
                        
                        <div className="text-sm line-through text-gray-500 bg-red-500/10 p-2 rounded border border-red-500/20">
                          {suggestion.original}
                        </div>
                        
                        <div className="text-sm text-gray-200 bg-green-500/10 p-2 rounded border border-green-500/20">
                          {suggestion.improved}
                        </div>
                        
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => rejectSuggestion(index)} className="flex-1 py-2 rounded-lg bg-overlay hover:bg-overlay-hover text-muted font-medium transition-colors text-xs">
                            Reject
                          </button>
                          <button onClick={() => acceptSuggestion(index)} className="flex-1 py-2 rounded-lg bg-accent-purple hover:bg-accent-purple/80 text-foreground font-bold transition-colors text-xs">
                            Accept
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                  
                  {suggestions.length > 0 && suggestions.every(s => s.status !== 'pending') && (
                      <div className="text-center p-8 text-muted text-sm">
                          All caught up! No pending suggestions.
                      </div>
                  )}
                  
                  {suggestions.length === 0 && !isCopilotThinking && (
                      <div className="text-center p-8 text-gray-500 text-sm border-2 border-dashed border-border rounded-xl">
                          Your Copilot suggestions will appear here.
                      </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
