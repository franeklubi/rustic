import { Result } from '../result/types';
import { Option } from '../option/types';


export interface SafeResponse
	extends Omit<
		Response,
		'trailer' | 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'
	>
{
	readonly trailer: Promise<Result<Headers, string>>;
	arrayBuffer(): Promise<Result<ArrayBuffer, string>>;
	blob(): Promise<Result<Blob, string>>;
	formData(): Promise<Result<FormData, string>>;
	json(): Promise<Result<any, string>>;
	text(): Promise<Result<string, string>>;
}

export interface SafeFetchError {
	response: Option<Response>;
	message: string;
}
