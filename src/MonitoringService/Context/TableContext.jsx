import React, { createContext, useContext, useState } from 'react';

const TableContext = createContext(null);

export function TableProvider({ children, onAction }) {
  const [page, setPage] = useState({ page: 1, limit: 10 });
  const [actions, setActions] = useState({});

  return (
    <TableContext.Provider
      value={{
        page,
        setPage,
        actions,
        setActions,
        onAction: onAction || (() => {}),
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const ctx = useContext(TableContext);
  if (!ctx) {
    throw new Error('useTable must be used inside TableProvider');
  }
  return ctx;
}
