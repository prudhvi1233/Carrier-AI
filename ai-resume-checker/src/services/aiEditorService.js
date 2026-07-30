import api from './api';

export const aiEditorService = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/ai-editor/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  analyzeResume: async (text) => {
    const response = await api.post('/ai-editor/analyze', { text });
    return response.data;
  },

  suggestEdits: async (blocks, prompt = null) => {
    // Only send required fields to avoid 422
    const cleanBlocks = blocks.map(b => ({
        block_id: b.block_id,
        text: b.text
    }));
    
    const payload = { blocks: cleanBlocks };
    if (prompt) {
        payload.prompt = prompt;
    }
    
    const response = await api.post('/ai-editor/suggest', payload);
    return response.data;
  },

  applyEdits: async (file, edits) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('edits_json', JSON.stringify(edits));
    const response = await api.post('/ai-editor/apply-edits', formData, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // This will be a Blob
  }
};
