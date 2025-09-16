// Plot size restrictions based on JSON data
export interface PlotRestrictions {
  maxFloors: number
  bedroomRange: { min: number; max: number }
  washroomRange: { min: number; max: number }
  allowedFeatures: {
    servantQuarter: boolean
    swimmingPool: boolean
    basement: boolean
    mumty: boolean
  }
  publicZones: string[]
  serviceZones: string[]
  kitchenTypes: string[]
}

export const getPlotRestrictions = async (plotSize: string, authority: string): Promise<PlotRestrictions | null> => {
  try {
    const plotKey = plotSize.replace(" ", "_")

    // Default restrictions for unknown combinations
    const defaultRestrictions: PlotRestrictions = {
      maxFloors: 2,
      bedroomRange: { min: 1, max: 3 },
      washroomRange: { min: 1, max: 4 },
      allowedFeatures: {
        servantQuarter: false,
        swimmingPool: false,
        basement: false,
        mumty: false,
      },
      publicZones: ["Drawing Room", "Dining Room", "TV Lounge"],
      serviceZones: ["Kitchen", "Store"],
      kitchenTypes: ["Open Kitchen", "Closed Kitchen"],
    }

    // Plot size specific restrictions based on JSON data
    const restrictions: Record<string, Record<string, PlotRestrictions>> = {
      "3_Marla": {
        LDA: {
          maxFloors: 3,
          bedroomRange: { min: 1, max: 2 },
          washroomRange: { min: 1, max: 2 },
          allowedFeatures: {
            servantQuarter: false,
            swimmingPool: false,
            basement: true,
            mumty: true,
          },
          publicZones: ["Drawing Room", "TV Lounge"],
          serviceZones: ["Kitchen", "Store"],
          kitchenTypes: ["Open Kitchen", "Closed Kitchen"],
        },
        DHA: {
          maxFloors: 2,
          bedroomRange: { min: 1, max: 2 },
          washroomRange: { min: 1, max: 2 },
          allowedFeatures: {
            servantQuarter: false, // Explicitly not allowed
            swimmingPool: false, // Explicitly not allowed
            basement: false,
            mumty: false,
          },
          publicZones: ["Drawing Room", "TV Lounge"],
          serviceZones: ["Kitchen"],
          kitchenTypes: ["Open Kitchen", "Closed Kitchen"],
        },
        Bahria: {
          maxFloors: 2,
          bedroomRange: { min: 1, max: 2 },
          washroomRange: { min: 1, max: 2 },
          allowedFeatures: {
            servantQuarter: false,
            swimmingPool: false,
            basement: false,
            mumty: true,
          },
          publicZones: ["Drawing Room", "TV Lounge"],
          serviceZones: ["Kitchen", "Store"],
          kitchenTypes: ["Open Kitchen", "Closed Kitchen"],
        },
      },
      "5_Marla": {
        LDA: {
          maxFloors: 3,
          bedroomRange: { min: 2, max: 3 },
          washroomRange: { min: 2, max: 4 },
          allowedFeatures: {
            servantQuarter: false,
            swimmingPool: false,
            basement: true,
            mumty: true,
          },
          publicZones: ["Drawing Room", "Dining Room", "TV Lounge"],
          serviceZones: ["Kitchen", "Store", "Laundry"],
          kitchenTypes: ["Open Kitchen", "Closed Kitchen", "Island Kitchen"],
        },
        DHA: {
          maxFloors: 2,
          bedroomRange: { min: 2, max: 3 },
          washroomRange: { min: 2, max: 3 },
          allowedFeatures: {
            servantQuarter: false, // Explicitly not allowed
            swimmingPool: false, // Still not allowed
            basement: false,
            mumty: false,
          },
          publicZones: ["Drawing Room", "Dining Room", "TV Lounge"],
          serviceZones: ["Kitchen", "Store"],
          kitchenTypes: ["Open Kitchen", "Closed Kitchen"],
        },
        Bahria: {
          maxFloors: 3,
          bedroomRange: { min: 2, max: 3 },
          washroomRange: { min: 2, max: 4 },
          allowedFeatures: {
            servantQuarter: false,
            swimmingPool: false,
            basement: false,
            mumty: true,
          },
          publicZones: ["Drawing Room", "Dining Room", "TV Lounge"],
          serviceZones: ["Kitchen", "Store", "Laundry"],
          kitchenTypes: ["Open Kitchen", "Closed Kitchen", "Island Kitchen"],
        },
      },
      "10_Marla": {
        LDA: {
          maxFloors: 4,
          bedroomRange: { min: 3, max: 5 },
          washroomRange: { min: 3, max: 6 },
          allowedFeatures: {
            servantQuarter: true,
            swimmingPool: true,
            basement: true,
            mumty: true,
          },
          publicZones: ["Drawing Room", "Dining Room", "TV Lounge", "Family Lounge", "Study Room"],
          serviceZones: ["Kitchen", "Store", "Laundry", "Servant Quarter", "Utility Room"],
          kitchenTypes: ["Open Kitchen", "Closed Kitchen", "Island Kitchen", "Modular Kitchen"],
        },
        DHA: {
          maxFloors: 2,
          bedroomRange: { min: 3, max: 4 },
          washroomRange: { min: 3, max: 5 },
          allowedFeatures: {
            servantQuarter: true, // Allowed for 10 Marla
            swimmingPool: false, // Still not allowed
            basement: false,
            mumty: false,
          },
          publicZones: ["Drawing Room", "Dining Room", "TV Lounge", "Family Lounge"],
          serviceZones: ["Kitchen", "Store", "Laundry", "Servant Quarter"],
          kitchenTypes: ["Open Kitchen", "Closed Kitchen", "Island Kitchen"],
        },
        Bahria: {
          maxFloors: 3,
          bedroomRange: { min: 3, max: 5 },
          washroomRange: { min: 3, max: 6 },
          allowedFeatures: {
            servantQuarter: true,
            swimmingPool: true,
            basement: false,
            mumty: true,
          },
          publicZones: ["Drawing Room", "Dining Room", "TV Lounge", "Family Lounge", "Study Room"],
          serviceZones: ["Kitchen", "Store", "Laundry", "Servant Quarter", "Utility Room"],
          kitchenTypes: ["Open Kitchen", "Closed Kitchen", "Island Kitchen", "Modular Kitchen"],
        },
      },
      "1_Kanal": {
        LDA: {
          maxFloors: 4,
          bedroomRange: { min: 4, max: 7 },
          washroomRange: { min: 4, max: 8 },
          allowedFeatures: {
            servantQuarter: true,
            swimmingPool: true,
            basement: true,
            mumty: true,
          },
          publicZones: ["Drawing Room", "Dining Room", "TV Lounge", "Family Lounge", "Study Room", "Guest Room"],
          serviceZones: ["Kitchen", "Store", "Laundry", "Servant Quarter", "Utility Room", "Pantry"],
          kitchenTypes: ["Open Kitchen", "Closed Kitchen", "Island Kitchen", "Modular Kitchen", "Chef Kitchen"],
        },
        DHA: {
          maxFloors: 3,
          bedroomRange: { min: 4, max: 6 },
          washroomRange: { min: 4, max: 7 },
          allowedFeatures: {
            servantQuarter: true,
            swimmingPool: true,
            basement: true,
            mumty: false,
          },
          publicZones: ["Drawing Room", "Dining Room", "TV Lounge", "Family Lounge", "Study Room", "Guest Room"],
          serviceZones: ["Kitchen", "Store", "Laundry", "Servant Quarter", "Utility Room"],
          kitchenTypes: ["Open Kitchen", "Closed Kitchen", "Island Kitchen", "Modular Kitchen"],
        },
        Bahria: {
          maxFloors: 3,
          bedroomRange: { min: 4, max: 7 },
          washroomRange: { min: 4, max: 8 },
          allowedFeatures: {
            servantQuarter: true,
            swimmingPool: true,
            basement: true,
            mumty: true,
          },
          publicZones: ["Drawing Room", "Dining Room", "TV Lounge", "Family Lounge", "Study Room", "Guest Room"],
          serviceZones: ["Kitchen", "Store", "Laundry", "Servant Quarter", "Utility Room", "Pantry"],
          kitchenTypes: ["Open Kitchen", "Closed Kitchen", "Island Kitchen", "Modular Kitchen", "Chef Kitchen"],
        },
      },
    }

    return restrictions[plotKey]?.[authority] || defaultRestrictions
  } catch (error) {
    console.error("Error getting plot restrictions:", error)
    return null
  }
}
