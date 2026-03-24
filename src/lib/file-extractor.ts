import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Security configuration for file uploads
 */
export const FILE_UPLOAD_CONFIG = {
	// Maximum file size: 10MB
	MAX_FILE_SIZE: 10 * 1024 * 1024,

	// Allowed MIME types (whitelist)
	ALLOWED_MIME_TYPES: [
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
		'text/plain',
		'text/markdown',
	] as const,

	// Allowed file extensions (whitelist)
	ALLOWED_EXTENSIONS: ['.pdf', '.docx', '.txt', '.md'] as const,
} as const;

export type AllowedFileExtension =
	(typeof FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS)[number];

/**
 * Validation error types
 */
export class FileValidationError extends Error {
	constructor(
		message: string,
		public code:
			| 'FILE_TOO_LARGE'
			| 'INVALID_FILE_TYPE'
			| 'INVALID_EXTENSION'
			| 'EXTRACTION_FAILED',
	) {
		super(message);
		this.name = 'FileValidationError';
	}
}

/**
 * Validates file before processing
 * @throws {FileValidationError} if validation fails
 */
export function validateFile(file: File): void {
	// Check file size
	if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
		throw new FileValidationError(
			`File size exceeds maximum allowed size of ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
			'FILE_TOO_LARGE',
		);
	}

	// Check MIME type
	const allowedMime = FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES as readonly string[];
	if (!allowedMime.includes(file.type)) {
		throw new FileValidationError(
			`File type "${file.type}" is not allowed. Allowed types: ${FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.join(', ')}`,
			'INVALID_FILE_TYPE',
		);
	}

	// Check file extension
	const extension =
		`.${file.name.split('.').pop()?.toLowerCase()}` as AllowedFileExtension;
	if (!FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(extension)) {
		throw new FileValidationError(
			`File extension "${extension}" is not allowed. Allowed extensions: ${FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`,
			'INVALID_EXTENSION',
		);
	}
}

/**
 * Sanitizes extracted text to prevent injection attacks
 */
function sanitizeText(text: string): string {
	// Remove null bytes
	let sanitized = text.replace(/\0/g, '');

	// Normalize whitespace but preserve structure
	sanitized = sanitized
		.replace(/\r\n/g, '\n') // Normalize line endings
		.replace(/\r/g, '\n')
		.replace(/\t/g, ' ') // Replace tabs with spaces
		.replace(/ +/g, ' ') // Collapse multiple spaces
		.trim();

	return sanitized;
}

/**
 * Extracts text from PDF files
 */
async function extractFromPDF(buffer: ArrayBuffer): Promise<string> {
	try {
		const parser = new PDFParse({ data: buffer });
		const textResult = await parser.getText();
		await parser.destroy();
		return sanitizeText(textResult.text);
	} catch (error) {
		throw new FileValidationError(
			`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
			'EXTRACTION_FAILED',
		);
	}
}

/**
 * Extracts text from Word (.docx) files
 */
async function extractFromDocx(buffer: ArrayBuffer): Promise<string> {
	try {
		const result = await mammoth.extractRawText({
			buffer: Buffer.from(buffer),
		});
		return sanitizeText(result.value);
	} catch (error) {
		throw new FileValidationError(
			`Failed to extract text from Word document: ${error instanceof Error ? error.message : 'Unknown error'}`,
			'EXTRACTION_FAILED',
		);
	}
}

/**
 * Extracts text from plain text files
 */
async function extractFromText(buffer: ArrayBuffer): Promise<string> {
	try {
		const text = new TextDecoder('utf-8').decode(buffer);
		return sanitizeText(text);
	} catch (error) {
		throw new FileValidationError(
			`Failed to extract text from file: ${error instanceof Error ? error.message : 'Unknown error'}`,
			'EXTRACTION_FAILED',
		);
	}
}

/**
 * Main extraction function that routes to appropriate handler
 * @param file - The file to extract text from
 * @returns Sanitized text content
 * @throws {FileValidationError} if validation or extraction fails
 */
export async function extractTextFromFile(file: File): Promise<string> {
	// Validate file first
	validateFile(file);

	// Get file buffer
	const buffer = await file.arrayBuffer();

	// Route to appropriate extractor based on file type
	const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;

	switch (extension) {
		case '.pdf':
			return await extractFromPDF(buffer);

		case '.docx':
			return await extractFromDocx(buffer);

		case '.txt':
		case '.md':
			return await extractFromText(buffer);

		default:
			throw new FileValidationError(
				`Unsupported file extension: ${extension}`,
				'INVALID_EXTENSION',
			);
	}
}

/**
 * Gets file metadata for logging/auditing
 */
export function getFileMetadata(file: File) {
	return {
		name: file.name,
		type: file.type,
		size: file.size,
		extension: `.${file.name.split('.').pop()?.toLowerCase()}`,
	};
}
