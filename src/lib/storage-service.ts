import { BlobServiceClient, ContainerClient, BlockBlobClient, PublicAccessType } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import crypto from 'crypto';

export class StorageService {
    private containerClient: ContainerClient;
    private readonly containerName: string;
    private readonly MAX_CONTAINER_NAME_LENGTH = 63;
    private readonly ALLOWED_CONTAINER_NAME_CHARS = /^[a-z0-9-]+$/;

    constructor(databaseIdHash: string) {
        const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        if (!accountName) {
            throw new Error('AZURE_STORAGE_ACCOUNT_NAME environment variable is not set');
        }

        // Sanitize and validate container name
        const sanitizedHash = this.sanitizeContainerName(databaseIdHash);
        this.containerName = `attachments-${sanitizedHash}`;
        
        if (this.containerName.length > this.MAX_CONTAINER_NAME_LENGTH) {
            // If too long, use a hash of the original name
            this.containerName = `attachments-${crypto.createHash('sha256').update(databaseIdHash).digest('hex').slice(0, 32)}`;
        }

        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            new DefaultAzureCredential()
        );

        this.containerClient = blobServiceClient.getContainerClient(this.containerName);
    }

    private sanitizeContainerName(name: string): string {
        // Convert to lowercase and replace invalid characters with hyphens
        const sanitized = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        // Remove consecutive hyphens
        return sanitized.replace(/-+/g, '-');
    }

    private validateStorageKey(***REMOVED***: string): void {
        if (!***REMOVED*** || typeof ***REMOVED*** !== 'string') {
            throw new Error('Invalid storage ***REMOVED***');
        }
        if (***REMOVED***.length > 1024) {
            throw new Error('Storage ***REMOVED*** exceeds maximum length');
        }
        // Add any additional validation as needed
    }

    private async ensureContainerExists(): Promise<void> {
        try {
            await this.containerClient.createIfNotExists();
        } catch (error) {
            console.error('Failed to create container:', error);
            throw new Error('Failed to initialize storage container');
        }
    }

    private sanitizeMetadataValue(value: string): string {
        // Remove or replace invalid characters in metadata values
        return value.replace(/[^\x20-\x7E]/g, '') // Only allow printable ASCII characters
                   .replace(/[\\/:*?"<>|]/g, '_'); // Replace invalid filename characters
    }

    public async saveAttachment(file: File, storageKey: string): Promise<void> {
        this.validateStorageKey(storageKey);
        await this.ensureContainerExists();

        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            
            const blockBlobClient = this.containerClient.getBlockBlobClient(storageKey);
            await blockBlobClient.uploadData(buffer, {
                blobHTTPHeaders: {
                    blobContentType: file.type,
                    blobCacheControl: 'no-cache',
                    blobContentDisposition: 'attachment'
                },
                metadata: {
                    originalName: this.sanitizeMetadataValue(file.name),
                    uploadDate: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Error saving attachment:', error);
            throw new Error('Failed to save attachment');
        }
    }

    public async readAttachment(storageKey: string): Promise<ArrayBuffer> {
        this.validateStorageKey(storageKey);
        
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(storageKey);
            const downloadResponse = await blockBlobClient.download();
            
            if (!downloadResponse.readableStreamBody) {
                throw new Error('Failed to download blob');
            }

            const chunks: Uint8Array[] = [];
            for await (const chunk of downloadResponse.readableStreamBody) {
                chunks.push(Buffer.isBuffer(chunk) ? new Uint8Array(chunk) : new Uint8Array(Buffer.from(chunk)));
            }

            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const result = new Uint8Array(totalLength);
            let offset = 0;
            
            for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.length;
            }

            return result.buffer;
        } catch (error) {
            console.error('Error reading attachment:', error);
            throw new Error('Failed to read attachment');
        }
    }

    public async deleteAttachment(storageKey: string): Promise<void> {
        this.validateStorageKey(storageKey);
        
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(storageKey);
            await blockBlobClient.deleteIfExists();
        } catch (error) {
            console.error('Error deleting attachment:', error);
            throw new Error('Failed to delete attachment');
        }
    }
}
