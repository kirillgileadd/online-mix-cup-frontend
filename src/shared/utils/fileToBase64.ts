/**
 * Конвертирует File в base64 строку
 * @param file - файл для конвертации
 * @returns Promise с base64 строкой (может содержать префикс data:image/...;base64,)
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Не удалось преобразовать файл в base64"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Ошибка при чтении файла"));
    };
    reader.readAsDataURL(file);
  });
};

