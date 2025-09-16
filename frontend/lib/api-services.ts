// API Service for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface FormOptions {
  authorities: {
    [key: string]: {
      plot_sizes: {
        [key: string]: {
          max_floors: number
          max_height_ft: number
          ground_coverage_percent: number
          FAR: string
          mandatory_open_spaces: {
            front: string
            rear: string
            side: string
          }
          special_rules: string[]
          parking: string
        }
      }
    }
  }
  global_options: {
    orientation: string[]
    facing: string[]
    shape: string[]
  }
  commercial: any
  special_provisions: any
  setback_rules: any
  common_requirements: any
}

export interface BylawsInfo {
  authority: string
  plot_size: string
  regulations: any
  common_requirements: any
  setback_rules: any
  special_provisions: any
}

export interface GeneratePlanRequest {
  city: string
  budget: string
  houseType: string
  authority: string
  plotSize: string
  frontDimension: string
  depthDimension: string
  orientation: string
  facing: string
  shape: string
  floors: string[]
  publicZones: string[]
  privateZones: string[]
  serviceZones: string[]
  bedrooms: string
  washrooms: string
  kitchenType: string
  garageCapacity: string
  extraRooms: string[]
  ecoFeatures: string[]
  additionalRequirements: string
  special_features: string[]
  outdoor_spaces: string[]
}

class ApiService {
  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async getFormOptions(): Promise<FormOptions> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/api/form-options`)
  }

  async getBylawsInfo(authority: string, plotSize: string): Promise<BylawsInfo> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/api/bylaws/${authority}/${plotSize}`)
  }

  async generatePlan(data: GeneratePlanRequest): Promise<any> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/api/generate-plan`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getHealthCheck(): Promise<any> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/api/health`)
  }

  async getDebugInfo(): Promise<any> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/api/debug`)
  }
}

export const apiService = new ApiService()
