"use client";

import { useState } from "react";
import { useDemoModal } from "@/components/home/demo-modal";
import Popover from "@/components/shared/popover";
import Tooltip from "@/components/shared/tooltip";
import { ChevronDown } from "lucide-react";

export default function ComponentGrid() {
  const { DemoModal, setShowDemoModal } = useDemoModal();
  const [openPopover, setOpenPopover] = useState(false);
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <DemoModal />
      <button
        onClick={() => setShowDemoModal(true)}
        className="flex w-36 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
      >
        <p className="text-gray-600">Cryptos</p>
      </button>
      <Popover
        content={
          <div className="w-full rounded-md bg-white p-2 sm:w-40">
            <button className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
              CFPT2501 (0.08) x100
            </button>
            <button className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
              CHPG2412 (0.04) x300
            </button>
            <button className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
              CTPB2405 (0.02) x100
            </button>
            <button className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
              CHDB2501 (0.10) x200
            </button>
          </div>
        }
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex w-36 items-center justify-between rounded-md border border-gray-300 px-4 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
        >
          <p className="text-gray-600">Stocks</p>
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-all ${openPopover ? "rotate-180" : ""
              }`}
          />
        </button>
      </Popover>
      <Tooltip content="Precedent is an opinionated collection of components, hooks, and utilities for your Next.js project.">
        <div className="flex w-36 cursor-default items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100">
          <p className="text-gray-600">Real Estate</p>
        </div>
      </Tooltip>
    </div>
  );
}
