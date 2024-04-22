import React, { useEffect, useReducer } from "react";
import { ErrorBoundary, Lang } from "fogito-core-ui";
import { calculateDiscount } from "@actions";

export const Totals = ({ items = [], fines = [], symbol }) => {
  const [state, setState] = useReducer(
    (prevState, newState) => {
      return { ...prevState, ...newState };
    },
    {
      totalExTax: 0,
      totalIncTax: 0,
      totalTax: 0,
      totalToPay: 0,
      totalDiscount: 0,
    }
  );

  useEffect(() => {
    calculateTotals(items, fines);
  }, [JSON.stringify(items), JSON.stringify(fines)]);

  const calculateTotals = (items, fines) => {
    let totalExTax = 0;
    let totalIncTax = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    let totalToPay = 0;

    if (items?.length) {
      items.map((row) => {
        totalExTax += parseFloat(row.price * row.quantity);
        totalIncTax += parseFloat(row.total);
        totalTax += parseFloat(row.tax);
        totalToPay += parseFloat(row.total);
        totalDiscount += calculateDiscount(row);
      });
    }

    if (fines.length) {
      fines.map((fine) => {
        let currDiss = calculateDiscount(fine);
        totalDiscount += currDiss;
        totalToPay += parseFloat(fine.price) - currDiss;
      });
    }

    setState({
      totalExTax: parseFloat(totalExTax).toFixed(2),
      totalIncTax: parseFloat(totalIncTax).toFixed(2),
      totalTax: parseFloat(totalTax).toFixed(2),
      totalToPay: parseFloat(totalToPay).toFixed(2),
      totalDiscount: parseFloat(totalDiscount).toFixed(2),
    });
  };

  const currencySymbol = symbol?.sign;
  return (
    <ErrorBoundary>
      <div className="totals-table-container">
        <div className="row">
          <div className="offset-md-8" />
          <div className="col-md-4 p-0">
            <table className="table">
              <tbody>
                <tr>
                  <td>{Lang.get("TotalExclTax")}</td>
                  <td>
                    {state.totalExTax} {currencySymbol}
                  </td>
                </tr>

                <tr>
                  <td>{Lang.get("TotalTax")}</td>
                  <td>
                    {state.totalTax} {currencySymbol}
                  </td>
                </tr>

                {/*{fines.length > 0 &&*/}
                {/*  fines.map((item, key) => (*/}
                {/*    <tr key={key}>*/}
                {/*      <td>{item.article_description || "---"}</td>*/}
                {/*      <td>*/}
                {/*        {item.price} {currencySymbol}*/}
                {/*      </td>*/}
                {/*    </tr>*/}
                {/*  ))}*/}

                {state.totalDiscount > 0 && (
                  <tr>
                    <td className="font-weight-bold">
                      {Lang.get("TotalDiscount")}
                    </td>
                    <td className="font-weight-bold">
                      -{state.totalDiscount} {currencySymbol}
                    </td>
                  </tr>
                )}

                <tr>
                  <td className="font-weight-bold">{Lang.get("TotalToPay")}</td>
                  <td className="font-weight-bold">
                    {state.totalToPay} {currencySymbol}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
