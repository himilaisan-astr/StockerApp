"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

interface StockProfitSliderProps {
  initialStock?: StockInfo | null;
  liveData?: any; // realtime Entrade data
}

interface StockInfo {
  ticker: string;
  initialPrice: number;
  currentPrice: number;
  quantity: number;
  purchaseDate?: string;
}

interface StockProfitModalProps {
  ticker: string;
  setTicker: (ticker: string) => void;
  priceInput: string;
  setPriceInput: (price: string) => void;
  quantityInput: string;
  setQuantityInput: (quantity: string) => void;
  purchaseDate: string;
  setPurchaseDate: (date: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  setShowModal: (show: boolean) => void;
  sliderMin: number;
  sliderMax: number;
}

function formatCurrency(amount: number): string {
  return (
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " ₫"
  );
}

const StockProfitModal: React.FC<StockProfitModalProps> = ({
  ticker,
  setTicker,
  priceInput,
  setPriceInput,
  quantityInput,
  setQuantityInput,
  purchaseDate,
  setPurchaseDate,
  onSubmit,
  setShowModal,
  sliderMin,
  sliderMax,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={() => setShowModal(false)}
    >
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4 relative z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-2">Edit Stock Info</h3>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="ticker">
            Ticker Symbol
          </label>
          <input
            id="ticker"
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="price">
            Price per stock (0.01 - 1)
          </label>
          <input
            id="price"
            type="number"
            step={0.001}
            min={sliderMin}
            max={sliderMax}
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            value={quantityInput}
            onChange={(e) => setQuantityInput(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="date">
            Purchase Date (optional)
          </label>
          <input
            id="date"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

const StockProfitSlider: React.FC<StockProfitSliderProps> = ({
  initialStock = null,
  liveData,
}) => {
  const [showModal, setShowModal] = useState(false);

  // sensible defaults if initialStock is null
  const defaultStock: StockInfo = {
    ticker: "N/A",
    initialPrice: 0.01,
    currentPrice: 0.01,
    quantity: 1,
  };

  // derive an initial stock either from props, from liveData, or default
  const initialFromProps: StockInfo = initialStock
    ? initialStock
    : {
        ticker: liveData?.ticker ?? defaultStock.ticker,
        initialPrice:
          typeof liveData?.initialPrice === "number"
            ? liveData.initialPrice
            : typeof liveData?.price === "number"
            ? liveData.price
            : defaultStock.initialPrice,
        currentPrice: typeof liveData?.price === "number" ? liveData.price : defaultStock.currentPrice,
        quantity: typeof liveData?.quantity === "number" ? liveData.quantity : defaultStock.quantity,
        purchaseDate: liveData?.purchaseDate ?? undefined,
      };

  // mergedStock applies liveData overrides (if any)
  const mergedStock: StockInfo = {
    ...initialFromProps,
    currentPrice: typeof liveData?.price === "number" ? liveData.price : initialFromProps.currentPrice,
    quantity: typeof liveData?.quantity === "number" ? liveData.quantity : initialFromProps.quantity,
  };

  const [ticker, setTicker] = useState<string>(mergedStock.ticker);
  const [priceInput, setPriceInput] = useState<string>(mergedStock.initialPrice.toString());
  const [quantityInput, setQuantityInput] = useState<string>(mergedStock.quantity.toString());
  const [purchaseDate, setPurchaseDate] = useState<string>(mergedStock.purchaseDate ?? "");

  const [stockInfo, setStockInfo] = useState<StockInfo>(mergedStock);
  const [sliderValue, setSliderValue] = useState<number>(mergedStock.currentPrice);

  useEffect(() => {
    // update state whenever liveData changes (realtime updates)
    if (!liveData) return;
    setStockInfo((prev) => ({
      ...prev,
      currentPrice: typeof liveData.price === "number" ? liveData.price : prev.currentPrice,
      quantity: typeof liveData.quantity === "number" ? liveData.quantity : prev.quantity,
    }));
    // update slider to reflect live price if provided
    if (typeof liveData.price === "number") {
      setSliderValue(liveData.price);
    }
    // note: we intentionally don't overwrite user edits (initialPrice etc.) here
  }, [liveData]);

  const sliderMin = 0.01;
  const sliderMax = 1;
  const unitToDong = 1000;

  const profit = (sliderValue - stockInfo.initialPrice) * stockInfo.quantity * unitToDong;
  const isProfit = profit >= 0;

  const onSliderDoubleClick = () => {
    setSliderValue(stockInfo.initialPrice);
  };

  const onResetClick = () => {
    setSliderValue(stockInfo.currentPrice);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(priceInput);
    const qtyNum = parseInt(quantityInput, 10);

    if (
      !ticker ||
      isNaN(priceNum) ||
      priceNum < sliderMin ||
      priceNum > sliderMax ||
      isNaN(qtyNum) ||
      qtyNum <= 0
    ) {
      alert(
        `Invalid input.\nTicker required.\nPrice must be between ${sliderMin} and ${sliderMax}.\nQuantity must be > 0.`
      );
      return;
    }

    setStockInfo({
      ticker: ticker.toUpperCase(),
      initialPrice: priceNum,
      currentPrice: sliderValue,
      quantity: qtyNum,
      purchaseDate: purchaseDate || undefined,
    });
    setShowModal(false);
  };

  return (
    <div className="max-w-md w-full mx-auto mt-36 p-4 space-y-4 border rounded-lg shadow-md bg-white mx-[10px]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{stockInfo.ticker}</h2>
          <p className="text-gray-600 text-sm">
            Bought at{" "}
            <span className="font-semibold">
              {formatCurrency(stockInfo.initialPrice * unitToDong)}
            </span>{" "}
            per stock × {stockInfo.quantity}{" "}
            {stockInfo.purchaseDate && (
              <span className="text-gray-400">({stockInfo.purchaseDate})</span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="m-4 -mt-4 -mr-1 bg-white-200 text-gray-400 rounded hover:text-blue-100 transition text-xl"
          title="Edit stock info"
        >
          <Pencil size={20} />
        </button>
      </div>

      <div>
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={0.001}
          value={sliderValue}
          onChange={(e) => setSliderValue(parseFloat(e.target.value))}
          onDoubleClick={onSliderDoubleClick}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-center text-sm text-gray-500 mt-1">
          <span>Price: {formatCurrency(sliderValue * unitToDong)}</span>
        </div>
      </div>

      <div className="relative w-40 h-40 mx-auto">
        <motion.svg
          className="absolute inset-0 m-auto"
          viewBox="0 0 100 100"
          width={160}
          height={160}
        >
          <motion.circle
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
            strokeWidth={7}
            strokeDasharray="0 1"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            cx="50"
            cy="50"
            r="45"
            fill={isProfit ? "#DCFCE7" : "#FEE2E2"}
            stroke={isProfit ? "#22C55E" : "#EF4444"}
          />
        </motion.svg>
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center font-display text-4xl font-bold ${
            isProfit ? "text-green-600" : "text-red-600"
          } z-10 select-none`}
        >
          {isProfit ? "+" : "-"}
          {formatCurrency(Math.abs(profit))}
        </div>
      </div>

      {showModal && (
        <StockProfitModal
          ticker={ticker}
          setTicker={setTicker}
          priceInput={priceInput}
          setPriceInput={setPriceInput}
          quantityInput={quantityInput}
          setQuantityInput={setQuantityInput}
          purchaseDate={purchaseDate}
          setPurchaseDate={setPurchaseDate}
          onSubmit={onSubmit}
          setShowModal={setShowModal}
          sliderMin={sliderMin}
          sliderMax={sliderMax}
        />
      )}
    </div>
  );
};

export default StockProfitSlider;
