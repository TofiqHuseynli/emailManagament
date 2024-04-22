import React from "react";
import Select from "react-select";
import classNames from "classnames";
import ErrorBoundary from "fogito-core-ui/build/components/error/ErrorBoundary";
import Lang from "fogito-core-ui/build/library/Lang";
import { calculateDiscount } from "@actions";
export const Row = ({
  taxrates,
  data,
  type,
  index,
  provided,
  snapshot,
  row,
  onDelete,
  onDiscount,
  onDiscountType,
  onDiscountTitle,
  onDiscounts,
  onTitleChange,
  onTaxChange,
  onColumnChangeEvent,
  discount_list = [],
  symbol,
}) => {
  return (
    <ErrorBoundary>
      <div
        className="mb-2"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <div className="d-flex">
          {data.length > 1 && (
            <div className="pl-0">
              <div
                className={classNames("drag-grid", {
                  dragging: snapshot.isDragging,
                })}
              >
                <img
                  src={`${process.env.publicPath}/assets/icons/grid.svg`}
                  alt=""
                />
              </div>
            </div>
          )}
          <div
            className={`${data.length > 1 ? "pl-2" : "pl-0"}`}
            style={{
              minWidth:
                type === "items"
                  ? data.length > 1
                    ? "18rem"
                    : "20.1rem"
                  : data.length > 1
                  ? "44.6rem"
                  : "46.8rem",
            }}
          >
            <input
              className="form-control"
              placeholder={Lang.get("Title")}
              type="text"
              maxLength="300"
              value={row.title || ""}
              onChange={(e) => onTitleChange(e.target.value, index, type)}
            />
          </div>
          {type === "items" && (
            <React.Fragment>
              <div className="px-2">
                <select
                  style={{ width: "105px" }}
                  className="custom-select"
                  value={row.tax_id}
                  onChange={(e) => {
                    let currentSetting = taxrates.find(
                      (setting) => setting.id === e.target.value
                    );
                    // onTaxChange(e.target.value, index, "tax", type)

                    onColumnChangeEvent(currentSetting?.rate, index, "vat");
                    onColumnChangeEvent(currentSetting?.id, index, "tax");
                    onColumnChangeEvent(currentSetting?.id, index, "tax_id");
                  }}
                >
                  <option value="">{Lang.get("VatRate")}</option>
                  {taxrates.map((item, key) => (
                    <option value={item.id} key={key}>
                      {item.rate}% {item.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="px-2">
                <input
                  style={{ width: "70px" }}
                  className="form-control"
                  placeholder={Lang.get("Quantity")}
                  type="number"
                  step={0.1}
                  min={0}
                  value={row.quantity || ""}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    // onQuantityChange(e.target.value, index, "quantity", type)
                    onColumnChangeEvent(e.target.value, index, "quantity")
                  }
                />
              </div>
              <div
                className="px-2"
                style={{ maxWidth: "7rem", minWidth: "7rem" }}
              >
                <input
                  className="form-control"
                  placeholder={Lang.get("Price")}
                  type="number"
                  step="any"
                  min={1}
                  onFocus={(e) => e.target.select()}
                  value={row.price || ""}
                  onChange={(e) =>
                    // onPriceChange(e.target.value, index, "price", type)
                    onColumnChangeEvent(e.target.value, index, "price")
                  }
                />
              </div>
              <div
                className="pr-2"
                style={{ maxWidth: "7rem", minWidth: "7rem" }}
              >
                <input
                  className="form-control"
                  placeholder={Lang.get("Tax")}
                  type="number"
                  min={0}
                  disabled={true}
                  step="any"
                  value={row.tax ?? 0}
                  onChange={(e) =>
                    onTaxChange(e.target.value, index, "tax", type)
                  }
                />
              </div>
            </React.Fragment>
          )}
          <div
            style={{ maxWidth: "7rem", minWidth: "7rem" }}
            className={`${type === "fines" ? "pl-2" : "pl-0"}`}
          >
            <input
              className="form-control"
              placeholder={Lang.get("Total")}
              type="number"
              min={1}
              onFocus={(e) => e.target.select()}
              step="any"
              value={row.total || ""}
              onChange={
                (e) =>
                  onColumnChangeEvent(parseInt(e.target.value), index, "total")
                // onPriceTaxChange(parseInt(e.target.value), index, "total", type)
              }
            />
          </div>
          <div className="d-flex align-items-center px-2">
            <i
              className="feather feather-trash-2 text-danger"
              onClick={() => onDelete(index, type)}
            />
          </div>
          <div className="d-flex align-items-center">
            <i
              className={`feather feather-${
                row.discount_condition ? "x" : "percent"
              } text-primary`}
              onClick={() => onDiscount(index, type, row)}
            />
          </div>
        </div>
        {!!row.discount_condition && (
          <div className="d-flex justify-content-end align-items-center mt-2">
            <div style={{ width: "10rem" }}>
              <input
                className="form-control"
                placeholder={Lang.get("DiscountTitle")}
                type="text"
                value={row.discount_title || ""}
                onChange={(e) => onDiscountTitle(e.target.value, index, type)}
              />
            </div>
            <div style={{ width: "10rem" }} className="px-2">
              <input
                className="form-control"
                placeholder={Lang.get("Discount")}
                type="number"
                min={0}
                step="any"
                value={row.discount_value || ""}
                onChange={(e) => onDiscounts(e.target.value, index, type)}
              />
            </div>
            <div
              style={{
                width: "10rem",
                cursor: "default",
              }}
            >
              <Select
                isClearable
                value={row.discount_type || null}
                onChange={(data) => onDiscountType(data, index, type)}
                options={discount_list}
                placeholder={Lang.get("Type")}
                className="form-control"
              />
            </div>
            <div className="text-nowrap ml-3">
              {calculateDiscount(row)} {symbol?.sign ? symbol?.sign : ""}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
