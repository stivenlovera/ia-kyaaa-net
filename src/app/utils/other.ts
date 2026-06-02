export const sleep = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));

export function generatePassword(length = 10) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

export function isNumber(valor: string): boolean {
  // Convierte el string a número y verifica que sea un número válido y no esté vacío
  return !isNaN(Number(valor)) && valor.trim() !== '';
}