import { apiCall, useMockApi } from '@/config/api.config';
import { EducationMaterial, CkdStage } from '@/types/adminTypes';

// Mock data for education materials
const mockEducationMaterials: EducationMaterial[] = [
  {
    id: 1,
    ckdStage: 1,
    langCode: 'en',
    type: 'diet',
    title: 'Diet Recommendations for CKD Stage 1',
    content: 'Limit protein intake to 0.8g per kg body weight. Reduce sodium intake to less than 2,300mg per day...'
  },
  {
    id: 2,
    ckdStage: 2,
    langCode: 'en',
    type: 'lifestyle',
    title: 'Exercise Guidelines for CKD Stage 2',
    content: 'Aim for 30 minutes of moderate exercise 5 days per week. Avoid high-intensity workouts...'
  },
  {
    id: 3,
    ckdStage: 3,
    langCode: 'en',
    type: 'general',
    title: 'Understanding CKD Stage 3',
    content: 'At stage 3, your kidneys are moderately damaged and not working as well as they should...'
  },
  {
    id: 4,
    ckdStage: 4,
    langCode: 'es',
    type: 'diet',
    title: 'Recomendaciones Dietéticas para ERC Etapa 4',
    content: 'Limite la ingesta de proteínas a 0.6g por kg de peso corporal. Reduzca el potasio y el fósforo...'
  },
  {
    id: 5,
    ckdStage: 5,
    langCode: 'en',
    type: 'general',
    title: 'Preparing for Dialysis - Stage 5 CKD',
    content: 'Stage 5 CKD means your kidneys are working at less than 15% capacity. Preparation for dialysis...'
  },
];

// Mock data for CKD stages
const mockCkdStages: CkdStage[] = [
  { id: 1, stageNumber: 1, minEgfr: 90, maxEgfr: 999, description: 'Kidney damage with normal or high kidney function' },
  { id: 2, stageNumber: 2, minEgfr: 60, maxEgfr: 89, description: 'Kidney damage with mild loss of kidney function' },
  { id: 3, stageNumber: 3, minEgfr: 30, maxEgfr: 59, description: 'Mild to severe loss of kidney function' },
  { id: 4, stageNumber: 4, minEgfr: 15, maxEgfr: 29, description: 'Severe loss of kidney function' },
  { id: 5, stageNumber: 5, minEgfr: 0, maxEgfr: 14, description: 'Kidney failure (End-stage renal disease)' },
];

// Fetch all education materials
export const fetchEducationMaterials = async (): Promise<EducationMaterial[]> => {
  if (useMockApi()) {
    console.log('Using mock data for education materials');
    return Promise.resolve(mockEducationMaterials);
  }
  
  try {
    const response = await apiCall<EducationMaterial[]>('/education');
    return response;
  } catch (error) {
    console.error('Error fetching education materials:', error);
    throw error;
  }
};

// Fetch education materials by CKD stage
export const fetchEducationMaterialsByStage = async (stage: number): Promise<EducationMaterial[]> => {
  if (useMockApi()) {
    console.log(`Using mock data for education materials of stage ${stage}`);
    return Promise.resolve(mockEducationMaterials.filter(m => m.ckdStage === stage));
  }
  
  try {
    const response = await apiCall<EducationMaterial[]>(`/education/stage/${stage}`);
    return response;
  } catch (error) {
    console.error(`Error fetching education materials for stage ${stage}:`, error);
    throw error;
  }
};

// Fetch a single education material by ID
export const fetchEducationMaterialById = async (id: number): Promise<EducationMaterial> => {
  if (useMockApi()) {
    console.log(`Using mock data for education material with id ${id}`);
    const material = mockEducationMaterials.find(m => m.id === id);
    if (!material) {
      throw new Error(`Education material with id ${id} not found`);
    }
    return Promise.resolve(material);
  }
  
  try {
    const response = await apiCall<EducationMaterial>(`/education/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching education material with id ${id}:`, error);
    throw error;
  }
};

// Create a new education material
export const createEducationMaterial = async (material: Omit<EducationMaterial, 'id'>): Promise<EducationMaterial> => {
  if (useMockApi()) {
    console.log('Using mock data to create education material');
    const newMaterial = {
      ...material,
      id: Math.max(...mockEducationMaterials.map(m => m.id)) + 1
    };
    mockEducationMaterials.push(newMaterial);
    return Promise.resolve(newMaterial);
  }
  
  try {
    const response = await apiCall<EducationMaterial>('/education', {
      method: 'POST',
      body: JSON.stringify(material)
    });
    return response;
  } catch (error) {
    console.error('Error creating education material:', error);
    throw error;
  }
};

// Update an existing education material
export const updateEducationMaterial = async (id: number, material: Omit<EducationMaterial, 'id'>): Promise<EducationMaterial> => {
  if (useMockApi()) {
    console.log(`Using mock data to update education material with id ${id}`);
    const index = mockEducationMaterials.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error(`Education material with id ${id} not found`);
    }
    const updatedMaterial = { ...material, id };
    mockEducationMaterials[index] = updatedMaterial;
    return Promise.resolve(updatedMaterial);
  }
  
  try {
    const response = await apiCall<EducationMaterial>(`/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(material)
    });
    return response;
  } catch (error) {
    console.error(`Error updating education material with id ${id}:`, error);
    throw error;
  }
};

// Delete an education material
export const deleteEducationMaterial = async (id: number): Promise<void> => {
  if (useMockApi()) {
    console.log(`Using mock data to delete education material with id ${id}`);
    const index = mockEducationMaterials.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error(`Education material with id ${id} not found`);
    }
    mockEducationMaterials.splice(index, 1);
    return Promise.resolve();
  }
  
  try {
    await apiCall(`/education/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error(`Error deleting education material with id ${id}:`, error);
    throw error;
  }
};

// Fetch all CKD stages
export const fetchCkdStages = async (): Promise<CkdStage[]> => {
  // For now, we'll just return the mock data since we don't have a separate API endpoint for CKD stages
  return Promise.resolve(mockCkdStages);
};
