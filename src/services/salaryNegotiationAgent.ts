/**
 * Salary Negotiation Agent
 * Helps students evaluate offers and negotiate better compensation
 */

import { BedrockService } from './bedrockService';
import schedulingDataService from './schedulingDataService';

interface OfferDetails {
  company: string;
  position: string;
  baseSalary: number;
  currency: string;
  location: string;
  benefits: {
    healthInsurance: boolean;
    dentalVision: boolean;
    retirement401k: number; // percentage match
    paidTimeOff: number; // days
    stockOptions: boolean;
    stockOptionsDetails?: string;
    bonuses: {
      signing: number;
      annual: number;
      performance: boolean;
    };
    other: string[];
  };
  workArrangement: 'remote' | 'hybrid' | 'onsite';
  startDate: string;
  deadline: string;
  negotiable: string[]; // which aspects are negotiable
}

interface MarketData {
  position: string;
  location: string;
  salaryRange: {
    min: number;
    max: number;
    median: number;
    percentile75: number;
    percentile90: number;
  };
  totalCompensation: {
    min: number;
    max: number;
    median: number;
  };
  benefits: {
    averagePTO: number;
    common401kMatch: number;
    stockOptionsPercentage: number;
  };
  marketTrends: {
    salaryGrowth: number; // percentage
    demandLevel: 'high' | 'medium' | 'low';
    competitionLevel: 'high' | 'medium' | 'low';
  };
}

interface NegotiationStrategy {
  overallAssessment: 'excellent' | 'good' | 'fair' | 'below_market';
  totalCompensationValue: number;
  marketComparison: {
    salaryVsMarket: number; // percentage difference
    benefitsVsMarket: 'above' | 'at' | 'below';
    totalVsMarket: number; // percentage difference
  };
  negotiationPoints: {
    priority: 'high' | 'medium' | 'low';
    aspect: string;
    currentValue: string;
    suggestedValue: string;
    justification: string;
    riskLevel: 'low' | 'medium' | 'high';
  }[];
  negotiationScript: string;
  alternativeStrategies: string[];
  riskAssessment: string;
  timeline: {
    initialResponse: string;
    negotiationWindow: string;
    finalDecision: string;
  };
}

class SalaryNegotiationAgent {
  
  // Analyze offer and generate negotiation strategy
  async analyzeOffer(
    userId: string,
    offerDetails: OfferDetails,
    userProfile: {
      experience: number; // years
      skills: string[];
      education: string;
      previousSalary?: number;
      otherOffers?: OfferDetails[];
    }
  ): Promise<NegotiationStrategy> {
    try {
      console.log(`💰 Analyzing offer from ${offerDetails.company}`);
      
      // Get market data
      const marketData = await this.getMarketData(offerDetails.position, offerDetails.location);
      
      // Calculate total compensation value
      const totalCompValue = this.calculateTotalCompensation(offerDetails);
      
      // Generate negotiation strategy using AI
      const strategy = await this.generateNegotiationStrategy(offerDetails, marketData, userProfile, totalCompValue);
      
      // Log analysis
      await schedulingDataService.logSchedulingInteraction(userId, {
        type: 'response_sent',
        company: offerDetails.company,
        position: offerDetails.position,
        timestamp: new Date().toISOString(),
        metadata: { 
          offerAnalysis: true, 
          baseSalary: offerDetails.baseSalary,
          totalComp: totalCompValue,
          assessment: strategy.overallAssessment
        }
      });
      
      console.log('✅ Offer analysis completed');
      return strategy;
    } catch (error) {
      console.error('❌ Failed to analyze offer:', error);
      throw error;
    }
  }

  // Get market data for position and location
  async getMarketData(position: string, location: string): Promise<MarketData> {
    const prompt = `
    Provide current market salary data for this role:
    
    Position: ${position}
    Location: ${location}
    
    Return comprehensive market data in JSON format:
    {
      "position": "${position}",
      "location": "${location}",
      "salaryRange": {
        "min": 80000,
        "max": 150000,
        "median": 115000,
        "percentile75": 130000,
        "percentile90": 145000
      },
      "totalCompensation": {
        "min": 90000,
        "max": 200000,
        "median": 140000
      },
      "benefits": {
        "averagePTO": 20,
        "common401kMatch": 4,
        "stockOptionsPercentage": 60
      },
      "marketTrends": {
        "salaryGrowth": 8.5,
        "demandLevel": "high",
        "competitionLevel": "high"
      }
    }
    
    Use current 2024 market data and be realistic about salary ranges.
    `;

    try {
      const response = await BedrockService.callBedrock(prompt, 1500);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse market data response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to get market data:', error);
      return this.getFallbackMarketData(position, location);
    }
  }

  // Calculate total compensation value
  calculateTotalCompensation(offer: OfferDetails): number {
    let total = offer.baseSalary;
    
    // Add signing bonus
    total += offer.benefits.bonuses.signing;
    
    // Add annual bonus (estimated)
    total += offer.benefits.bonuses.annual;
    
    // Add 401k match value (estimated)
    total += offer.baseSalary * (offer.benefits.retirement401k / 100);
    
    // Add PTO value (estimated at daily rate)
    const dailyRate = offer.baseSalary / 260; // 260 working days
    total += dailyRate * offer.benefits.paidTimeOff;
    
    // Add stock options value (rough estimate)
    if (offer.benefits.stockOptions) {
      total += offer.baseSalary * 0.1; // Rough 10% estimate
    }
    
    // Add health insurance value (estimated)
    if (offer.benefits.healthInsurance) {
      total += 12000; // Average annual health insurance value
    }
    
    return Math.round(total);
  }

  // Generate negotiation strategy using AI
  async generateNegotiationStrategy(
    offer: OfferDetails,
    marketData: MarketData,
    userProfile: any,
    totalCompValue: number
  ): Promise<NegotiationStrategy> {
    const prompt = `
    Create a comprehensive salary negotiation strategy:
    
    OFFER DETAILS:
    Company: ${offer.company}
    Position: ${offer.position}
    Base Salary: $${offer.baseSalary}
    Total Compensation: $${totalCompValue}
    Location: ${offer.location}
    Benefits: ${JSON.stringify(offer.benefits)}
    
    MARKET DATA:
    Median Salary: $${marketData.salaryRange.median}
    75th Percentile: $${marketData.salaryRange.percentile75}
    Market Total Comp: $${marketData.totalCompensation.median}
    Market Trends: ${JSON.stringify(marketData.marketTrends)}
    
    USER PROFILE:
    Experience: ${userProfile.experience} years
    Skills: ${userProfile.skills.join(', ')}
    Previous Salary: $${userProfile.previousSalary || 'Not provided'}
    
    Generate a detailed negotiation strategy in JSON format:
    {
      "overallAssessment": "excellent|good|fair|below_market",
      "totalCompensationValue": ${totalCompValue},
      "marketComparison": {
        "salaryVsMarket": -5.2,
        "benefitsVsMarket": "above",
        "totalVsMarket": 2.1
      },
      "negotiationPoints": [
        {
          "priority": "high",
          "aspect": "Base Salary",
          "currentValue": "$${offer.baseSalary}",
          "suggestedValue": "$130,000",
          "justification": "Market data shows 75th percentile at $130k",
          "riskLevel": "low"
        }
      ],
      "negotiationScript": "Professional negotiation email template",
      "alternativeStrategies": ["strategy1", "strategy2"],
      "riskAssessment": "Low risk - strong market position",
      "timeline": {
        "initialResponse": "Respond within 2-3 days",
        "negotiationWindow": "1-2 weeks for back and forth",
        "finalDecision": "Make decision 2-3 days before deadline"
      }
    }
    
    Be specific, realistic, and professional in recommendations.
    `;

    try {
      const response = await BedrockService.callBedrock(prompt, 2500);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse negotiation strategy response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to generate negotiation strategy:', error);
      return this.getFallbackStrategy(offer, marketData, totalCompValue);
    }
  }

  // Generate negotiation email
  async generateNegotiationEmail(
    strategy: NegotiationStrategy,
    offer: OfferDetails,
    userProfile: any
  ): Promise<string> {
    const prompt = `
    Write a professional salary negotiation email based on this strategy:
    
    Company: ${offer.company}
    Position: ${offer.position}
    Current Offer: $${offer.baseSalary}
    
    Key Negotiation Points:
    ${strategy.negotiationPoints.map(point => 
      `- ${point.aspect}: ${point.currentValue} → ${point.suggestedValue} (${point.justification})`
    ).join('\n')}
    
    Overall Assessment: ${strategy.overallAssessment}
    Risk Level: ${strategy.riskAssessment}
    
    Write a professional, respectful email that:
    1. Expresses enthusiasm for the role
    2. Thanks them for the offer
    3. Presents negotiation points with market justification
    4. Maintains positive tone
    5. Suggests next steps
    
    Keep it concise but comprehensive.
    `;

    try {
      const response = await BedrockService.callBedrock(prompt, 1500);
      return response.trim();
    } catch (error) {
      console.error('Failed to generate negotiation email:', error);
      return this.getFallbackNegotiationEmail(offer, strategy);
    }
  }

  // Compare multiple offers
  async compareOffers(offers: OfferDetails[]): Promise<{
    comparison: {
      offer: OfferDetails;
      totalValue: number;
      marketPosition: string;
      pros: string[];
      cons: string[];
      recommendation: string;
    }[];
    bestOverall: string;
    insights: string[];
  }> {
    const comparisons = [];
    
    for (const offer of offers) {
      const totalValue = this.calculateTotalCompensation(offer);
      const marketData = await this.getMarketData(offer.position, offer.location);
      
      const comparison = {
        offer,
        totalValue,
        marketPosition: this.getMarketPosition(offer.baseSalary, marketData),
        pros: this.identifyOfferPros(offer, marketData),
        cons: this.identifyOfferCons(offer, marketData),
        recommendation: this.getOfferRecommendation(offer, marketData, totalValue)
      };
      
      comparisons.push(comparison);
    }
    
    // Determine best overall offer
    const bestOffer = comparisons.reduce((best, current) => 
      current.totalValue > best.totalValue ? current : best
    );
    
    const insights = await this.generateOfferInsights(comparisons);
    
    return {
      comparison: comparisons,
      bestOverall: bestOffer.offer.company,
      insights
    };
  }

  // Helper methods
  private getMarketPosition(salary: number, marketData: MarketData): string {
    if (salary >= marketData.salaryRange.percentile90) return 'Excellent (90th+ percentile)';
    if (salary >= marketData.salaryRange.percentile75) return 'Above Average (75th+ percentile)';
    if (salary >= marketData.salaryRange.median) return 'Average (50th+ percentile)';
    return 'Below Average (<50th percentile)';
  }

  private identifyOfferPros(offer: OfferDetails, marketData: MarketData): string[] {
    const pros = [];
    
    if (offer.baseSalary >= marketData.salaryRange.percentile75) {
      pros.push('Competitive base salary');
    }
    
    if (offer.benefits.stockOptions) {
      pros.push('Equity compensation included');
    }
    
    if (offer.benefits.bonuses.signing > 0) {
      pros.push(`$${offer.benefits.bonuses.signing.toLocaleString()} signing bonus`);
    }
    
    if (offer.workArrangement === 'remote') {
      pros.push('Remote work flexibility');
    }
    
    if (offer.benefits.paidTimeOff > 20) {
      pros.push('Generous PTO policy');
    }
    
    return pros;
  }

  private identifyOfferCons(offer: OfferDetails, marketData: MarketData): string[] {
    const cons = [];
    
    if (offer.baseSalary < marketData.salaryRange.median) {
      cons.push('Below market salary');
    }
    
    if (!offer.benefits.stockOptions) {
      cons.push('No equity compensation');
    }
    
    if (offer.benefits.bonuses.signing === 0) {
      cons.push('No signing bonus');
    }
    
    if (offer.workArrangement === 'onsite') {
      cons.push('No remote work flexibility');
    }
    
    if (offer.benefits.paidTimeOff < 15) {
      cons.push('Limited PTO');
    }
    
    return cons;
  }

  private getOfferRecommendation(offer: OfferDetails, marketData: MarketData, totalValue: number): string {
    const salaryPosition = offer.baseSalary / marketData.salaryRange.median;
    
    if (salaryPosition >= 1.1 && totalValue >= marketData.totalCompensation.median) {
      return 'Strong offer - consider accepting or minor negotiation';
    } else if (salaryPosition >= 0.95) {
      return 'Fair offer - negotiate key points';
    } else {
      return 'Below market - significant negotiation recommended';
    }
  }

  private async generateOfferInsights(comparisons: any[]): Promise<string[]> {
    // Generate AI insights about the offers
    const insights = [
      `You have ${comparisons.length} offers to compare`,
      'Consider total compensation, not just base salary',
      'Factor in location cost of living differences',
      'Evaluate growth opportunities and company culture'
    ];
    
    return insights;
  }

  // Fallback methods
  private getFallbackMarketData(position: string, location: string): MarketData {
    return {
      position,
      location,
      salaryRange: {
        min: 70000,
        max: 140000,
        median: 105000,
        percentile75: 120000,
        percentile90: 135000
      },
      totalCompensation: {
        min: 80000,
        max: 180000,
        median: 130000
      },
      benefits: {
        averagePTO: 18,
        common401kMatch: 4,
        stockOptionsPercentage: 50
      },
      marketTrends: {
        salaryGrowth: 6.0,
        demandLevel: 'medium',
        competitionLevel: 'medium'
      }
    };
  }

  private getFallbackStrategy(offer: OfferDetails, marketData: MarketData, totalCompValue: number): NegotiationStrategy {
    return {
      overallAssessment: 'fair',
      totalCompensationValue: totalCompValue,
      marketComparison: {
        salaryVsMarket: ((offer.baseSalary - marketData.salaryRange.median) / marketData.salaryRange.median) * 100,
        benefitsVsMarket: 'at',
        totalVsMarket: 0
      },
      negotiationPoints: [{
        priority: 'high',
        aspect: 'Base Salary',
        currentValue: `$${offer.baseSalary.toLocaleString()}`,
        suggestedValue: `$${marketData.salaryRange.percentile75.toLocaleString()}`,
        justification: 'Market data supports higher compensation',
        riskLevel: 'low'
      }],
      negotiationScript: 'Professional negotiation recommended',
      alternativeStrategies: ['Focus on benefits', 'Request performance review timeline'],
      riskAssessment: 'Low risk negotiation',
      timeline: {
        initialResponse: '2-3 days',
        negotiationWindow: '1-2 weeks',
        finalDecision: '2-3 days before deadline'
      }
    };
  }

  private getFallbackNegotiationEmail(offer: OfferDetails, strategy: NegotiationStrategy): string {
    return `Dear Hiring Manager,

Thank you for the offer for the ${offer.position} role at ${offer.company}. I'm very excited about this opportunity and the chance to contribute to your team.

After reviewing the offer details, I'd like to discuss the compensation package. Based on my research of market rates for similar positions in ${offer.location}, I believe there may be room for adjustment.

I would appreciate the opportunity to discuss this further. I'm confident we can reach an agreement that works for both parties.

Thank you for your consideration, and I look forward to hearing from you.

Best regards,
[Your Name]`;
  }
}

export default new SalaryNegotiationAgent();