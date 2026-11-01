// A field-level validation error sent by the backend (400 responses)
export type Errors = {
    field: string,
    message: string,
}

// Envelope of every successful backend response; T is the shape of `data`
export type ApiSuccess<T> = {
    success: true;
    message: string;
    data: T;
};

// Envelope of every failed backend response
// `data.errors` is only present for 400 validation errors
// `status` is the HTTP status code (401 = token refused); absent when the backend could not be reached
export type ApiError = {
    success: false;
    message: string;
    error?: string;
    status?: number;
    data?: {
        errors: Errors[];
    };
};

// Discriminated union: checking `success` tells TypeScript which one it is
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
