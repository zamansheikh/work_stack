import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://192.168.56.1:5000/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxyRequest(request, resolvedParams.path, 'GET');
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxyRequest(request, resolvedParams.path, 'POST');
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxyRequest(request, resolvedParams.path, 'PUT');
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxyRequest(request, resolvedParams.path, 'DELETE');
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxyRequest(request, resolvedParams.path, 'PATCH');
}

async function handleProxyRequest(
    request: NextRequest,
    path: string[],
    method: string
) {
    try {
        const pathString = path.join('/');
        const url = `${BACKEND_URL}/${pathString}`;

        // Get search params from the original request
        const searchParams = new URL(request.url).searchParams;
        const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

        // Prepare headers for the backend request
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Copy authorization header if present
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let body: any = undefined;

        // Handle request body for methods that support it
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            const contentType = request.headers.get('content-type');

            if (contentType?.includes('application/json')) {
                body = JSON.stringify(await request.json());
            } else if (contentType?.includes('multipart/form-data')) {
                // For file uploads, we need to handle FormData
                body = await request.formData();
                delete headers['Content-Type']; // Let fetch set the boundary
            } else {
                body = await request.text();
            }
        }

        // Make the request to the backend
        const response = await fetch(fullUrl, {
            method,
            headers: body instanceof FormData ? undefined : headers,
            body: body instanceof FormData ? body : body,
        });

        // Get response data
        let responseData;
        const responseContentType = response.headers.get('content-type');

        if (responseContentType?.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        // Create the response with CORS headers
        const nextResponse = NextResponse.json(responseData, {
            status: response.status,
            statusText: response.statusText,
        });

        // Add CORS headers
        nextResponse.headers.set('Access-Control-Allow-Origin', '*');
        nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return nextResponse;

    } catch (error) {
        console.error('Proxy error:', error);

        const errorResponse = NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to proxy request' },
            { status: 500 }
        );

        // Add CORS headers even for error responses
        errorResponse.headers.set('Access-Control-Allow-Origin', '*');
        errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return errorResponse;
    }
}

// Handle preflight requests
export async function OPTIONS() {
    const response = new NextResponse(null, { status: 200 });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
}
