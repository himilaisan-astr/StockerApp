"use client"

import React from "react"
import useEmblaCarousel from "embla-carousel-react"
import StockProfitSlider from "./stock-profit-slider"

const stockList = [
  {
    ticker: "CFPT2501",
    initialPrice: 0.080,
    currentPrice: 0.080,
    quantity: 100,
    purchaseDate: "4/6"
  },
  {
    ticker: "CHDB2501",
    initialPrice: 0.100,
    currentPrice: 0.110,
    quantity: 200,
    purchaseDate: "5/6"
  },
  {
    ticker: "CHPG2412",
    initialPrice: 0.040,
    currentPrice: 0.040,
    quantity: 300,
    purchaseDate: "5/6"
  },
  {
    ticker: "CTPB2405",
    initialPrice: 0.02,
    currentPrice: 0.010,
    quantity: 100,
    purchaseDate: "5/6"
  }
]

const StockCarousel: React.FC = () => {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: "center" })

  return (
    <div className="overflow-hidden px-6 max-w-md mx-auto" ref={emblaRef}>
      <div className="flex gap-6">
        {stockList.map((stock, i) => (
          <div key={i} className="flex-[0_0_100%] max-w-md">
            <StockProfitSlider initialStock={stock} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default StockCarousel
