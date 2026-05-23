import { 
    AssetFeedResponse, 
    AssetRead, 
    UserCreate, 
    UserRead, 
    LicenseTypeRead, 
    CategoryRead, 
    AssetCreate,
    ReviewRead,
    UserTypeResponse
} from "./api-types";

const BASE_URL = "http://localhost:5000";

// Helper for handling API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // For 201 Created and 204 No Content, which might have empty bodies.
    if (response.status === 201 || response.status === 204) {
      // Try to parse JSON, but return an empty object if it fails,
      // as these successful responses may not have a body.
      return response.json().catch(() => ({}) as any);
    }
    const error = await response.json();
    console.error("API Error:", error);
    throw new Error(`API request failed with status ${response.status}`);
  }
  // For successful responses (like 200 OK), we expect a JSON body.
  return response.json() as Promise<T>;
}


// === ASSETS ===

export async function getAssetFeed(
  userId: number | null
): Promise<AssetFeedResponse> {
  const url = new URL(`${BASE_URL}/feed/assets`);
  if (userId) {
    url.searchParams.append('user_id', String(userId));
  }
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

// === REVIEWS ===

export async function getReviewsByAssetId(assetId: number): Promise<ReviewRead[]> {
    const response = await fetch(`${BASE_URL}/reviews/asset/${assetId}`);
    return handleResponse<ReviewRead[]>(response);
}

// === USER TYPES ===

export async function getUserTypes(): Promise<UserTypeResponse[]> {
    const response = await fetch(`${BASE_URL}/user_type/`);
    return handleResponse<UserTypeResponse[]>(response);
}
