import fs from 'node:fs';
import path from 'node:path';
import type { IFolderContents } from '../interfaces/IFolderContent.ts';

export class fileNavig {
    static async getFolderContents(folderPath: string, fileExtension: string): Promise<IFolderContents[]> {
        const foldersPath = path.join(process.cwd(), "/src/", folderPath);
        const folders = fs.readdirSync(foldersPath);
        const results: IFolderContents[] = [];

        for (const folder of folders) {
            const currentFolderPath = path.join(foldersPath, folder);
            const folderFiles = fs.readdirSync(currentFolderPath).filter((file) => file.endsWith(fileExtension));
            
            for (const file of folderFiles) {
                const filePath = path.join(currentFolderPath, file);
                
                const folderImport = await import(filePath);
                
                results.push({
                    folderPath: currentFolderPath,
                    folderImport: folderImport
                });
            }
        }

        if (results.length === 0) {
            throw new Error(`No files with extension "${fileExtension}" found in ${foldersPath}`);
        }
        
        return results;
    }
}
