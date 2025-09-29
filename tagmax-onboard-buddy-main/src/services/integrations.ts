// Google Sheets and Drive integration service
export interface VehicleData {
  state: string;
  licensePlate: string;
  nickname?: string;
}

export interface CSATData {
  rating: number;
  feedback?: string;
}

const GOOGLE_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwCZ-7YK94L7J1FNR8ggRL_WzypK1RtRz5_NKzH6Rhj7Uij4iYgYfTSpN48boZe0mvBoQ/exec';
const GOOGLE_DRIVE_ENDPOINT = 'https://script.google.com/macros/s/AKfycbypsI_F2JEOA3SLdOQkcJFTZcca6vr68wfs68YrlK-ZtkBFfyAJnUEuCH2LQLm7dryB/exec';

export const saveToGoogleSheets = async (data: any) => {
  const payload = new URLSearchParams();
  payload.append('data', JSON.stringify(data));

  const response = await fetch(GOOGLE_SHEETS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload,
  });

  if (!response.ok) {
    throw new Error('Failed to save to Google Sheets');
  }

  return response.json();
};

export const uploadToGoogleDrive = async (file: File, licensePlate: string) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix

        const payload = new URLSearchParams();
        payload.append('data', JSON.stringify({
          imageBase64: base64Data,
          contentType: file.type,
          licensePlate: licensePlate
        }));

        const response = await fetch(GOOGLE_DRIVE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: payload,
        });

        if (!response.ok) {
          throw new Error('Failed to upload to Google Drive');
        }

        const result = await response.json();
        resolve(result.fileUrl || 'Upload successful');
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};