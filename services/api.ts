import { 
    AssetFeedResponse, 
    AssetRead, 
    UserCreate, 
    UserRead, 
    LicenseTypeRead, 
    CategoryRead, 
    AssetCreate,
    ReviewRead,
    UserTypeResponse,
    ReviewCreate
} from "./api-types";

const BASE_URL = "http://localhost:5000";

// Helper for handling API responses
async function handleResponse<T>(response: Response): Promise<T> {
  // First, handle non-ok statuses (4xx, 5xx)
  if (!response.ok) {
    try {
      const error = await response.json();
      console.error("API Error:", error);
      // Try to create a meaningful error message from the server's response
      const errorMessage = typeof error === 'object' && error !== null && 'detail' in error 
        ? (error as any).detail 
        : JSON.stringify(error);
      throw new Error(errorMessage);
    } catch (e) {
      // If the error response itself isn't valid JSON, throw a generic error
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
  }

  // For successful responses (2xx), check for empty body
  if (response.status === 204) { // 204 No Content
    return {} as T; // Return an empty object as there is no body
  }

  // For other successful responses (200, 201, etc.), parse the JSON body.
  return response.json() as Promise<T>;
}


// === ASSETS ===

export async function getAssetFeed(
  filters: AssetFilterParams = {}
): Promise<AssetFeedResponse> {
  const url = new URL(`${BASE_URL}/feed/assets`);
  // Append filter parameters to the URL
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  return handleResponse<AssetFeedResponse>(response);
}

export async function getAssetById(id: number): Promise<AssetRead> {
  const response = await fetch(`${BASE_URL}/assets/${id}`);
  return handleResponse<AssetRead>(response);
}

export async function createAsset(asset: AssetCreate): Promise<AssetRead> {
    const response = await fetch(`${BASE_URL}/assets/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asset),
    });
    return handleResponse<AssetRead>(response);
}


// === USERS ===

export async function loginUser(credentials: LoginRequest): Promise<UserRead> {
    const response = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    return handleResponse<UserRead>(response);
}

export async function getUserById(id: number): Promise<UserRead> {
    const response = await fetch(`${BASE_URL}/user/${id}`);
    return handleResponse<UserRead>(response);
}

export async function createUser(user: UserCreate): Promise<UserRead> {
  const response = await fetch(`${BASE_URL}/user/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return handleResponse<UserRead>(response);
}


// === FAVORITES ===

export async function addFavorite(userId: number, assetId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/favorites/${userId}/${assetId}`, {
        method: 'POST',
    });
    await handleResponse(response);
}

export async function removeFavorite(userId: number, assetId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/favorites/${userId}/${assetId}`, {
        method: 'DELETE',
    });
    await handleResponse(response);
}


// === LICENSES ===

export async function getLicenseTypeById(id: number): Promise<LicenseTypeRead> {
    const response = await fetch(`${BASE_URL}/license_types/${id}`);
    return handleResponse<LicenseTypeRead>(response);
}

export async function getLicenseTypes(): Promise<LicenseTypeRead[]> {
    const response = await fetch(`${BASE_URL}/license_types/`);
    return handleResponse<LicenseTypeRead[]>(response);
}


// === CATEGORIES ===

export async function getCategories(): Promise<CategoryRead[]> {
    const response = await fetch(`${BASE_URL}/categories/`);
    return handleResponse<CategoryRead[]>(response);
}

export async function getCategoriesTree(): Promise<CategoryReadWithChildren[]> {
    const response = await fetch(`${BASE_URL}/categories/tree`);
    return handleResponse<CategoryReadWithChildren[]>(response);
}

// === REVIEWS ===

export async function getReviewsByAssetId(assetId: number): Promise<ReviewRead[]> {
    const response = await fetch(`${BASE_URL}/reviews/asset/${assetId}`);
    return handleResponse<ReviewRead[]>(response);
}

export async function createReview(review: ReviewCreate): Promise<ReviewRead> {
    const response = await fetch(`${BASE_URL}/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
    });
    return handleResponse<ReviewRead>(response);
}

// === USER TYPES ===

export async function getUserTypes(): Promise<UserTypeResponse[]> {
    const response = await fetch(`${BASE_URL}/user_type/`);
    return handleResponse<UserTypeResponse[]>(response);
}
