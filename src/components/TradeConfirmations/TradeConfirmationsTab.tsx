import React, { useState, useMemo } from "react";
import { EquityTrade, FXTrade } from "../../types/trade";
import TradeFilters from "./TradeFilters";
import TradeCard from "./TradeCard";
import { TradeLifecycle } from "../../types/lifecycle";

interface TradeConfirmationsTabProps {
  equityTrades: EquityTrade[];
  fxTrades: FXTrade[];
  lifecycles: TradeLifecycle[];
}

// Pie chart helper for the date analysis card
const PieChart = ({
  data,
  colors,
}: {
  data: { name: string; value: number }[];
  colors: string[];
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  let currentAngle = 0;
  return (
    <svg width={200} height={200} className="drop-shadow-sm">
      {data.map((item, index) => {
        const angle = total > 0 ? (item.value / total) * 360 : 0;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        const midAngle = startAngle + angle / 2;
        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;
        const midAngleRad = (midAngle * Math.PI) / 180;
        const x1 = centerX + radius * Math.cos(startAngleRad);
        const y1 = centerY + radius * Math.sin(startAngleRad);
        const x2 = centerX + radius * Math.cos(endAngleRad);
        const y2 = centerY + radius * Math.sin(endAngleRad);
        const largeArcFlag = angle > 180 ? 1 : 0;
        const pathData = [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          "Z",
        ].join(" ");
        // For label position
        const labelRadius = radius * 0.7;
        const labelX = centerX + labelRadius * Math.cos(midAngleRad);
        const labelY = centerY + labelRadius * Math.sin(midAngleRad);
        currentAngle += angle;
        const percentage =
          total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
        return (
          <g key={index}>
            <path
              d={pathData}
              fill={colors[index % colors.length]}
              stroke="white"
              strokeWidth="2"
              className="hover:opacity-80 transition-opacity duration-200"
            />
            {item.value > 0 && (
              <g>
                <rect
                  x={labelX - 32}
                  y={labelY - 18}
                  width="64"
                  height="36"
                  rx="8"
                  fill="#fff"
                  fillOpacity="0.85"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  className="drop-shadow"
                />
                <text
                  x={labelX}
                  y={labelY - 2}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="bold"
                  fill="#111827"
                  style={{ pointerEvents: "none" }}
                >
                  {item.name}
                </text>
                <text
                  x={labelX}
                  y={labelY + 13}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                  style={{ pointerEvents: "none" }}
                >
                  {item.value} ({percentage}%)
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const TradeConfirmationsTab: React.FC<TradeConfirmationsTabProps> = ({
  equityTrades,
  fxTrades,
  lifecycles,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tradeTypeFilter, setTradeTypeFilter] = useState("");
  const [counterpartyFilter, setCounterpartyFilter] = useState("");
  const [tradeDateFilter, setTradeDateFilter] = useState("");

  const allTrades = useMemo(() => {
    return [...equityTrades, ...fxTrades];
  }, [equityTrades, fxTrades]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const stats = {
      total: allTrades.length,
      completed: 0,
      inProgress: 0,
      completionRate: 0,
    };

    allTrades.forEach((trade) => {
      const isEquityTrade = "quantity" in trade;
      const status = isEquityTrade
        ? (trade as EquityTrade).confirmationStatus
        : (trade as FXTrade).tradeStatus;

      if (status.toLowerCase() === "settled") {
        stats.completed++;
      } else {
        stats.inProgress++;
      }
    });

    stats.completionRate =
      allTrades.length > 0 ? (stats.completed / allTrades.length) * 100 : 0;
    return stats;
  }, [allTrades]);

  const filteredTrades = useMemo(() => {
    return allTrades.filter((trade) => {
      const isEquityTrade = "quantity" in trade;

      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          trade.tradeId.toLowerCase().includes(searchLower) ||
          trade.counterparty.toLowerCase().includes(searchLower) ||
          (isEquityTrade &&
            (trade as EquityTrade).clientId
              .toLowerCase()
              .includes(searchLower)) ||
          (!isEquityTrade &&
            (trade as FXTrade).currencyPair
              .toLowerCase()
              .includes(searchLower));

        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter) {
        const tradeStatus = isEquityTrade
          ? (trade as EquityTrade).confirmationStatus
          : (trade as FXTrade).tradeStatus;
        if (tradeStatus !== statusFilter) return false;
      }

      // Trade type filter
      if (tradeTypeFilter) {
        if (isEquityTrade) {
          if ((trade as EquityTrade).tradeType !== tradeTypeFilter)
            return false;
        } else {
          if ((trade as FXTrade).productType !== tradeTypeFilter) return false;
        }
      }

      // Counterparty filter
      if (counterpartyFilter) {
        if (trade.counterparty !== counterpartyFilter) return false;
      }

      // Trade date filter
      if (tradeDateFilter) {
        const tradeDate = isEquityTrade
          ? (trade as EquityTrade).tradeDate
          : (trade as FXTrade).tradeDate;
        if (!tradeDate.includes(tradeDateFilter)) return false;
      }

      return true;
    });
  }, [
    allTrades,
    searchTerm,
    statusFilter,
    tradeTypeFilter,
    counterpartyFilter,
    tradeDateFilter,
  ]);

  // State for date analysis card
  const [analysisDate, setAnalysisDate] = useState("");

  // Helper to get status for equity and fx
  const getTradeStatus = (trade: EquityTrade | FXTrade) => {
    return "quantity" in trade
      ? (trade as EquityTrade).confirmationStatus
      : (trade as FXTrade).tradeStatus;
  };

  // Helper to get trade date for equity and fx
  const getTradeDate = (trade: EquityTrade | FXTrade) => {
    return "quantity" in trade
      ? (trade as EquityTrade).tradeDate
      : (trade as FXTrade).tradeDate;
  };

  // Helper to get settlement date for equity and fx
  const getSettlementDate = (trade: EquityTrade | FXTrade) => {
    return "quantity" in trade
      ? (trade as EquityTrade).settlementDate
      : (trade as FXTrade).settlementDate;
  };

  // Trades confirmed (equity) or booked (fx) on selected date (for table)
  const tradesOpenedOnDate = useMemo(() => {
    if (!analysisDate) return [];
    return allTrades.filter((trade) => {
      const isEquityTrade = "quantity" in trade;
      const tradeDate = getTradeDate(trade);
      const statusDay = getTradeStatus(trade);
      if (isEquityTrade) {
        return tradeDate === analysisDate && statusDay === "Confirmed";
      } else {
        return tradeDate === analysisDate && statusDay === "Booked";
      }
    });
  }, [allTrades, analysisDate]);

  // Of those, how many were settled on the next day (for pie chart)
  const closedNextDayCount = useMemo(() => {
    if (!analysisDate) return 0;
    const nextDay = (() => {
      const d = new Date(analysisDate);
      d.setDate(d.getDate() + 1);
      return d.toISOString().slice(0, 10);
    })();
    return tradesOpenedOnDate.filter((trade) => {
      const settlementDate = getSettlementDate(trade);
      return settlementDate === nextDay;
    }).length;
  }, [tradesOpenedOnDate, analysisDate]);

  const registeredCount = tradesOpenedOnDate.length;
  const notClosedNextDay = registeredCount - closedNextDayCount;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Trade Confirmations
        </h2>
        <p className="text-gray-600">
          Manage and view all trade confirmations. Total trades:{" "}
          {allTrades.length}
        </p>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trades</p>
              <p className="text-2xl font-bold text-gray-900">
                {summaryStats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">T</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">
                {summaryStats.inProgress}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {summaryStats.completionRate.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {summaryStats.completed}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Activity Board Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Trade Activity Board
            </h3>
            <p className="text-gray-500 text-sm">
              Select a date to see how many trades were registered and how many
              were closed (settled) the next day.
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <label
              htmlFor="analysis-date"
              className="text-sm font-medium text-gray-700"
            >
              Date:
            </label>
            <input
              id="analysis-date"
              type="date"
              value={analysisDate}
              onChange={(e) => setAnalysisDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
        </div>
        {analysisDate && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 min-h-[220px]">
            <div className="flex-1 flex items-center justify-center">
              <PieChart
                data={[
                  { name: "Settled Next Day", value: closedNextDayCount },
                  { name: "Not Settled Next Day", value: notClosedNextDay },
                ]}
                colors={["#10B981", "#F59E42"]}
              />
            </div>
            <div className="flex-1 flex flex-col items-center md:items-start mt-8 md:mt-0">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex items-center justify-between group rounded-lg px-2 py-1">
                  <span className="text-sm font-medium text-gray-800">
                    Confirmed/Booked on {analysisDate}
                  </span>
                  <span className="text-sm text-gray-600 tabular-nums">
                    {registeredCount}
                  </span>
                </div>
                <div className="flex items-center justify-between group rounded-lg px-2 py-1">
                  <span className="text-sm font-medium text-gray-800">
                    Settled Next Day
                  </span>
                  <span className="text-sm text-green-700 tabular-nums">
                    {closedNextDayCount} (
                    {registeredCount > 0
                      ? ((closedNextDayCount / registeredCount) * 100).toFixed(
                          1
                        )
                      : "0.0"}
                    %)
                  </span>
                </div>
                <div className="flex items-center justify-between group rounded-lg px-2 py-1">
                  <span className="text-sm font-medium text-gray-800">
                    Not Settled Next Day
                  </span>
                  <span className="text-sm text-yellow-700 tabular-nums">
                    {notClosedNextDay} (
                    {registeredCount > 0
                      ? ((notClosedNextDay / registeredCount) * 100).toFixed(1)
                      : "0.0"}
                    %)
                  </span>
                </div>
              </div>
              {/* Table of trades: all confirmed/booked on selected day, show if settled next day */}
              <div className="mt-6 w-full overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trade ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Counterparty
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status (Selected Day)
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status (Next Day)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tradesOpenedOnDate.map((trade) => {
                      const isEquityTrade = "quantity" in trade;
                      const statusDay = getTradeStatus(trade);
                      const settlementDate = getSettlementDate(trade);
                      const nextDay = (() => {
                        const d = new Date(analysisDate);
                        d.setDate(d.getDate() + 1);
                        return d.toISOString().slice(0, 10);
                      })();
                      const statusNextDay =
                        settlementDate === nextDay ? "Settled" : "-";
                      return (
                        <tr key={trade.tradeId}>
                          <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                            {trade.tradeId}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {isEquityTrade ? "Equity" : "FX"}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {trade.counterparty}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {statusDay}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {statusNextDay}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {!analysisDate && (
          <div className="text-center text-gray-400 py-8">
            Select a date to view trade registration and closure analysis.
          </div>
        )}
      </div>

      <TradeFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        tradeTypeFilter={tradeTypeFilter}
        onTradeTypeFilterChange={setTradeTypeFilter}
        counterpartyFilter={counterpartyFilter}
        onCounterpartyFilterChange={setCounterpartyFilter}
        tradeDateFilter={tradeDateFilter}
        onTradeDateFilterChange={setTradeDateFilter}
      />

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredTrades.length} of {allTrades.length} trades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrades.map((trade) => (
          <TradeCard 
            key={trade.tradeId} 
            trade={trade} 
            lifecycle={lifecycles.find(l => l.tradeId === trade.tradeId)}
          />
        ))}
      </div>

      {filteredTrades.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No trades found matching your criteria.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
    </div>
  );
};

export default TradeConfirmationsTab;
