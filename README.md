# ML Portfolio Dashboard Documentation

## Overview

The ML Portfolio Dashboard is a comprehensive React-based application that provides real-time portfolio performance tracking enhanced by machine learning predictions and news sentiment analysis. The dashboard allows users to explore different investment strategies, backtest results, and analyze market sentiment impact on their investments.

## Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI with Tailwind CSS
- **Charts**: Recharts library
- **Data Fetching**: Axios with Alpha Vantage API
- **Routing**: React Router v6

### Project Structure
```
src/
├── components/
│   ├── Dashboard/
│   │   ├── ControlPanel.tsx      # Asset selection and configuration
│   │   ├── InteractiveChart.tsx  # Main chart visualization
│   │   ├── KeyMetricsPanel.tsx   # Performance metrics display
│   │   └── SentimentAnalysis.tsx # News sentiment analysis
│   ├── home.tsx                  # Main dashboard layout
│   └── ui/                       # Reusable UI components (Shadcn)
├── services/
│   └── stockApi.ts              # Data fetching and processing
└── types/
    └── supabase.ts              # Type definitions
```

## Core Components

### 1. Home Component (`src/components/home.tsx`)
**Purpose**: Main dashboard orchestrator that manages state and data flow between all components.

**Key Responsibilities**:
- Manages global state for stock data, news data, and metrics
- Coordinates data fetching from external APIs
- Handles user interactions and updates between components
- Implements loading states and error handling

**State Management**:
- `stockData`: Array of historical stock price data
- `newsData`: Array of news items with sentiment scores
- `metrics`: Calculated portfolio performance metrics
- `selectedAsset`: Currently selected stock symbol
- `loading`: Loading state for async operations

### 2. Control Panel (`src/components/Dashboard/ControlPanel.tsx`)
**Purpose**: User interface for configuring dashboard parameters and triggering actions.

**Features**:
- **Asset Selection**: Dropdown to choose from predefined stocks (AAPL, MSFT, GOOGL, AMZN, TSLA)
- **Date Range Selection**: Calendar pickers for start and end dates
- **Trading Strategy**: Tabs for Momentum, Mean Reversion, and Sentiment strategies
- **ML Model Selection**: Dropdown for XGBoost, LSTM, and Ensemble models
- **Backtest Button**: Triggers data refresh and recalculation

**Event Handlers**:
- `onAssetChange`: Triggers new data fetch for selected asset
- `onDateRangeChange`: Filters data by date range and smoothly transitions to custom mode
- `onStrategyChange`: Updates strategy selection (affects calculations)
- `onModelChange`: Updates ML model selection
- `onBacktest`: Refreshes all data and recalculates metrics

### 3. Interactive Chart (`src/components/Dashboard/InteractiveChart.tsx`)
**Purpose**: Main visualization component displaying stock performance with ML predictions.

**Chart Types**:
- **Equity Curve**: Shows actual vs predicted stock prices over time
- **Drawdowns**: Visualizes portfolio drawdown periods
- **Returns**: Compares actual vs predicted returns

**Interactive Features**:
- Zoom controls with slider (1-100% of data)
- Time period selection (1W, 1M, 3M, 6M, 1Y, All, Custom)
- Toggle actual vs predicted data series
- Responsive design with tooltips
- Smooth transitions between time periods

**Data Processing**:
- Transforms raw stock data into chart-ready format
- Calculates drawdowns from peak values
- Generates ML predictions using technical indicators

### 4. Key Metrics Panel (`src/components/Dashboard/KeyMetricsPanel.tsx`)
**Purpose**: Displays calculated portfolio performance metrics in card format.

**Metrics Displayed**:
- **Sharpe Ratio**: Risk-adjusted return measure
- **Max Drawdown**: Largest peak-to-trough decline
- **Cumulative Return**: Total return over selected period
- **Volatility**: Annualized standard deviation of returns
- **Win Rate**: Percentage of profitable periods
- **Sortino Ratio**: Downside risk-adjusted return

### 5. Sentiment Analysis (`src/components/Dashboard/SentimentAnalysis.tsx`)
**Purpose**: Displays news articles with sentiment scores and impact analysis.

**Features**:
- News filtering by sentiment (All, Positive, Neutral, Negative)
- Color-coded sentiment indicators
- Impact bars showing predicted price influence
- Clickable news links to original sources
- Scrollable news feed with tooltips

## Data Flow

### 1. Initial Load
```
Home Component Mounts
    ↓
loadData("AAPL") called
    ↓
Parallel API calls:
- fetchStockData("AAPL")
- fetchNewsSentiment("AAPL")
    ↓
Data processed and state updated
    ↓
Components re-render with new data
```

### 2. User Interactions
```
User selects new asset in ControlPanel
    ↓
handleAssetChange() called in Home
    ↓
loadData(newAsset) triggered
    ↓
All components update with new data
```

### 3. Date Range Changes
```
User selects date range in ControlPanel
    ↓
handleDateRangeChange() called in Home
    ↓
fetchStockData() with date filters
    ↓
Chart smoothly transitions to "custom" mode
    ↓
Chart and metrics update with new data
```

## API Integration

### Stock Data API (`src/services/stockApi.ts`)

**Primary Data Source**: Alpha Vantage API
- **Endpoint**: `https://www.alphavantage.co/query`
- **Function**: `TIME_SERIES_DAILY`
- **Fallback**: Demo data generation when API fails

**Data Processing**:
1. Fetch raw time series data
2. Transform to standardized format
3. Apply date range filters
4. Sort chronologically
5. Generate ML predictions using technical analysis

**ML Prediction Algorithm**:
The prediction system uses multiple technical indicators:
- **Moving Averages**: 5, 10, 20-day SMAs
- **RSI**: Relative Strength Index for momentum
- **Bollinger Bands**: Volatility-based predictions
- **Volume Analysis**: Trading volume impact
- **Sentiment Integration**: News sentiment weighting

### News Sentiment API
**Current Implementation**: Mock data with realistic news sources
**Future Enhancement**: Integration with NewsAPI or similar service

**Sentiment Scoring**:
- Range: -1.0 (very negative) to +1.0 (very positive)
- Impact Score: 0.0 to 1.0 (predicted price influence)
- Sources: Financial Times, Bloomberg, Reuters, MarketWatch, CNBC

## Performance Calculations

### Sharpe Ratio
```typescript
sharpeRatio = (avgReturn * 252) / volatility
```

### Max Drawdown
```typescript
// Track running maximum and calculate largest decline
let peak = initialPrice;
let maxDrawdown = 0;
for (each price) {
  if (price > peak) peak = price;
  drawdown = (peak - price) / peak;
  if (drawdown > maxDrawdown) maxDrawdown = drawdown;
}
```

### Volatility (Annualized)
```typescript
volatility = sqrt(variance) * sqrt(252)
```

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Running in VS Code
1. Open the project folder in VS Code
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The application will open automatically at `http://localhost:3000`

## Troubleshooting

### Common Issues

**1. White Screen in VS Code**
- Ensure all dependencies are installed: `npm install`
- Check the browser console for JavaScript errors
- Verify the development server is running: `npm run dev`
- Clear browser cache and reload
- Check if port 3000 is available or change port in vite.config.ts

**2. Chart Not Loading**
- Check API key configuration in `src/services/stockApi.ts`
- Verify network connectivity
- Check browser console for API errors
- Ensure date range is valid

**3. Date Range Not Working Smoothly**
- Verify that `chartTimePeriod` state updates to "custom"
- Check console logs for date range updates
- Ensure start date is before end date
- Check if data exists for selected period

**4. Predictions Seem Unrealistic**
- Predictions use technical analysis indicators
- Real ML models would require extensive training data
- Consider this a demonstration of UI capabilities
- Check technical indicator calculations in `stockApi.ts`

### Debug Mode
Enable debug logging by opening browser console and checking for:
- API response errors
- Date range update logs
- Component rendering issues
- Network request failures

### Performance Issues
- Large date ranges may slow down chart rendering
- Consider implementing data pagination
- Use React DevTools to identify re-rendering issues
- Monitor network requests in browser DevTools

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_ALPHA_VANTAGE_API_KEY=your_api_key_here
```

### API Configuration
- Alpha Vantage API key: Get free key at https://www.alphavantage.co/support/#api-key
- Rate limits: 5 calls per minute, 500 calls per day (free tier)
- Demo key is used by default but has limited functionality

## Future Enhancements

### Planned Features
1. **Real ML Models**: Integration with actual XGBoost/LSTM models
2. **Live Data**: WebSocket connections for real-time updates
3. **Portfolio Management**: Multi-asset portfolio tracking
4. **Advanced Analytics**: More sophisticated technical indicators
5. **User Authentication**: Personal portfolio management
6. **Export Features**: PDF reports and data export
7. **Mobile Optimization**: Responsive design improvements

### Technical Improvements
1. **Caching**: Implement data caching for better performance
2. **Error Handling**: More robust error boundaries
3. **Testing**: Unit and integration test coverage
4. **Accessibility**: WCAG compliance improvements
5. **Performance**: Code splitting and lazy loading
6. **Real-time Updates**: WebSocket integration
7. **Data Persistence**: Local storage for user preferences

## Contributing

When contributing to this project:
1. Follow TypeScript best practices
2. Maintain component isolation
3. Update documentation for new features
4. Test across different screen sizes
5. Ensure accessibility compliance
6. Test date range transitions thoroughly
7. Verify smooth user experience in different IDEs

## License

This project is open source and available under the MIT License.
