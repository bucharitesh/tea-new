import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { memo, useEffect, useState } from "react";

const PaginationPages = ({
  pages,
  currentPage,
  setCurrentPage
}: {
  pages: number;
  currentPage: number,
  setCurrentPage: any
}) => {
  return (
    <Pagination className="w-full flex justify-end items-center mt-5">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => {
              if(currentPage <= pages && currentPage > 0)
              setCurrentPage(currentPage - 1)
            }}
            isActive={currentPage !== 0}
          />
        </PaginationItem>
        {Array.apply(null, Array(pages)).map((_, i) => i).map((index) => (
          <PaginationItem>
            <PaginationLink
              onClick={() => setCurrentPage(index)}
              isActive={currentPage === index}
              className="cursor-pointer"
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => {
              if(currentPage < pages - 1 && currentPage >= 0)
              setCurrentPage(currentPage + 1)
            }}
            isActive={currentPage !== pages - 1}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default memo(PaginationPages);
