import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ErrorBoundary from "fogito-core-ui/build/components/error/ErrorBoundary";
import Lang from "fogito-core-ui/build/library/Lang";
import useDimensions from "fogito-core-ui/build/hooks/useDimensions";
import { Row } from "./components";
import { calculateDiscount, InvoiceSettings, taxRatesList } from "@actions";

export const MultiForm = ({
  label,
  type,
  data,
  setData,
  id = "",
  parentType,
  defaultVat = 0,
  symbol = [],
  defaultRate = null,
}) => {
  const dimensions = useDimensions();
  const [rates, setRates] = React.useState([]);
  const onAdd = (target) => {
    let array = data[target];
    if (parentType === "add") {
      if (target === "items") {
        array.push({
          title: "",
          quantity: 1,
          price: 0,
          tax: 0,
          tax_id: defaultRate?.id || "",
          discount_value: 0,
          discount_title: "",
          discount_type: null,
          total: 0,
          type: "item",
          vat: defaultRate?.rate || 0,
        });
      } else {
        array.push({
          type: "fine",
          title: "",
          discount_value: 0,
          discount_title: "",
          discount_type: null,
          total: 0,
          vat: defaultRate?.rate || 0,
        });
      }
    } else {
      if (target === "items") {
        array.push({
          offer_id: id || "",
          title: "",
          quantity: 1,
          price: 0,
          tax_id: defaultRate?.id || "",
          tax: 0,
          discount_value: 0,
          discount_title: "",
          discount_type: null,
          total: 0,
          type: "item",
          vat: defaultRate?.rate || 0,
        });
      } else {
        array.push({
          offer_id: id || "",
          type: "fine",
          discount_value: 0,
          discount_title: "",
          discount_type: null,
          title: "",
          total: 0,
          vat: defaultRate?.rate || 0,
        });
      }
    }

    setData({ ...data, [target]: array });
  };

  const onDelete = (id, target) => {
    let array = data[target];
    array.splice(id, 1);
    setData({ ...data, [target]: array });
  };

  const onDiscount = (id, target, row) => {
    setData({
      ...data,
      [target]: data?.[target].map((item, i) => {
        if (i === id) {
          item.discount_condition = !row.discount_condition;
          item.discount_title = "";
          item.discount_value = 0;
          item.discount_type = null;
        }
        return item;
      }),
    });
  };

  const loadTaxRates = async () => {
    let response = await taxRatesList();
    if (response) {
      if (response.status === "success") {
        setRates(response.data);
      }
    }
  };

  const onTitleChange = (value, index, target) => {
    let array = data[target];
    array[index]["title"] = value;
    setData({ ...data, [target]: array });
  };

  const onDiscountTitle = (value, index, target) => {
    let array = data[target];
    array[index]["discount_title"] = value;
    setData({ ...data, [target]: array });
  };

  const onDiscounts = (value, index, target) => {
    let array = data[target];
    array[index]["discount_value"] = value || 0;
    setData({ ...data, [target]: array });

    onColumnChangeEvent(array[index]["vat"], index, "vat");
  };

  const onDiscountType = (value, index, target) => {
    let array = data[target];
    array[index]["discount_type"] = value;
    setData({ ...data, [target]: array });

    onColumnChangeEvent(array[index]["vat"], index, "vat");
  };

  const onPriceChange = (value, index, name, target) => {
    let array = data[target];
    array[index][name] = value;
    let vat = parseInt(array[index]["vat"]);
    let price_per_unit = parseFloat(array[index]["price"]);
    array[index]["total"] = parseFloat(
      (price_per_unit + (price_per_unit * vat) / 100) * array[index]["quantity"]
    );

    array[index]["tax"] = parseFloat(
      ((array[index]["price"] * array[index]["vat"]) / 100) *
        array[index]["quantity"]
    )?.toFixed(2);
    setData({
      ...data,
      [target]: array,
    });
  };

  const onQuantityChange = (value, index, name, target) => {
    let array = data[target];
    array[index][name] = value;
    let vat = parseInt(array[index]["vat"]);
    let price_per_unit = parseFloat(array[index]["price"]);

    array[index]["total"] = parseFloat(
      (price_per_unit + (price_per_unit * vat) / 100) * array[index][name]
    );

    array[index]["tax"] = parseFloat(
      ((array[index]["price"] * array[index]["vat"]) / 100) * array[index][name]
    )?.toFixed(2);

    // array[index]["total"] = calculatePriceWithVat(
    //   array[index]["price"],
    //   array[index]["tax"],
    //   value
    // );
    setData({
      ...data,
      [target]: array,
    });
  };

  const onTaxChange = (value, index, name, target) => {
    let array = data[target];
    array[index][name] = value;
    array[index]["total"] = calculatePriceWithVat(
      array[index]["price"],
      value,
      array[index]["quantity"]
    );
    setData({
      ...data,
      [target]: array,
    });
  };

  const onRateChange = (currentRate, index, name, target) => {
    let array = data[target];
    array[index][name] = currentRate?.id || "";
    array[index]["vat"] = currentRate?.rate || 0;
    let vat = parseInt(array[index]["vat"]);
    let price_per_unit = parseFloat(array[index]["price"]);

    array[index]["total"] = parseFloat(
      (price_per_unit + (price_per_unit * vat) / 100) * array[index]["quantity"]
    );
    array[index]["tax"] = parseFloat(
      ((price_per_unit * vat) / 100) * array[index]["quantity"]
    )?.toFixed(2);
    setData({
      ...data,
      [target]: array,
    });
  };

  const onColumnChangeEvent = (value, index, colName) => {
    let array = data.items;
    value = value || 0;
    array[index][colName] = value;

    let discountVal = calculateDiscount(array[index]);
    let quantity = parseFloat(array[index]["quantity"]);
    let vat = array[index]["vat"] ? parseInt(array[index]["vat"]) : 0;
    let price_per_unit = parseFloat(array[index]["price"]);
    // price_per_unit = price
    // price_inc_tax = total

    let totalVat;
    if (colName === "total") {
      price_per_unit = ((value / quantity) * 100) / (100 + vat) + discountVal;
      array[index]["price"] = parseFloat(price_per_unit).toFixed(2);

      let totalExcVat = price_per_unit * quantity - discountVal;
      totalVat = (totalExcVat * vat) / 100;
    } else {
      let totalExcVat = price_per_unit * quantity - discountVal;
      totalVat = (totalExcVat * vat) / 100;
      array[index]["total"] = parseFloat(totalExcVat + totalVat).toFixed(2);
    }

    array[index]["tax"] = parseFloat(totalVat).toFixed(2);

    setData({
      ...data,
      ["items"]: array,
    });
  };

  const onPriceTaxChange = (value, index, name, target) => {
    let array = data[target];
    array[index][name] = value;
    array[index]["price"] =
      data.vat_included == 0
        ? calculatePriceWithVat(
            array[index][name],
            0,
            array[index]["quantity"],
            true
          )
        : calculatePriceWithVat(
            array[index][name],
            array[index]["tax"],
            array[index]["quantity"],
            true
          );
    setData({
      ...data,
      [target]: array,
    });
  };

  const calculatePriceWithVat = (price, tax, quantity, reverse = false) => {
    let result;
    price = parseFloat(price);
    tax = parseInt(tax);
    quantity = parseInt(quantity);
    if (!reverse) {
      result = (price + (price * tax) / 100) * quantity;
    } else {
      price = price / quantity;
      result = (100 * price) / (100 + tax);
    }

    return result;
  };

  const onDragEnd = (result) => {
    const columns = data[type];
    if (!result.destination) return;

    const items = reorder(
      columns,
      result.source.index,
      result.destination.index
    );
    setData({ ...data, [type]: items });
  };

  const discount_list = [{ label: "%", value: "percentage" }].concat([
    {
      label: symbol?.label,
      value: "currency",
    },
  ]);

  React.useEffect(() => {
    loadTaxRates()
  }, []);
 
  return (
    <ErrorBoundary>
      <div
        className={`d-flex flex-column ${
          dimensions.width <= 1200 ? "overflow-x-scroll w-100" : ""
        }`}
      >
        <label className="form-control-label">{Lang.get(label)}</label>
        {!!data[type].length && (
          <div className="my-table">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="table" direction="vertical" type={type}>
                {(provided) => (
                  <div
                    className="table"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <div className="table-head">
                      <span style={{ marginLeft: "2rem" }}>
                        {Lang.get("Title")}
                      </span>
                      {type === "items" && (
                        <React.Fragment>
                          <span style={{ marginLeft: "16rem" }}>
                            {Lang.get("VatRate")}
                          </span>
                          <span style={{ marginLeft: "4.3rem" }}>
                            {Lang.get("Quantity")}
                          </span>
                          <span style={{ marginLeft: "2rem" }}>
                            {Lang.get("VatExclude")}
                          </span>
                          <span style={{ marginLeft: "2rem" }}>
                            {Lang.get("Tax")}
                          </span>
                        </React.Fragment>
                      )}
                      <span
                        style={{
                          marginLeft: type === "items" ? "5.3rem" : "34.6rem",
                        }}
                      >
                        {Lang.get("VatInclude")}
                      </span>
                    </div>
                    <div className="mt-3">
                      {!!data[type].length &&
                        data[type].map((row, index) => {
                          let uniq_id = "_id_" + index;
                          return (
                            <Draggable
                              key={uniq_id}
                              draggableId={uniq_id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                if (snapshot.isDragging) {
                                  provided.draggableProps.style.left =
                                    provided.draggableProps.style.offsetLeft;
                                  provided.draggableProps.style.top =
                                    provided.draggableProps.style.offsetTop;
                                  // provided.draggableProps.style.display =
                                  //   "flex";
                                }
                                return (
                                  <Row
                                    taxrates={rates}
                                    data={data[type]}
                                    prices={data.vat_included}
                                    row={row}
                                    type={type}
                                    index={index}
                                    provided={provided}
                                    snapshot={snapshot}
                                    onTitleChange={onTitleChange}
                                    onDiscountTitle={onDiscountTitle}
                                    onDiscountType={onDiscountType}
                                    onDiscounts={onDiscounts}
                                    onPriceChange={onPriceChange}
                                    onQuantityChange={onQuantityChange}
                                    onTaxChange={onTaxChange}
                                    onRateChange={onRateChange}
                                    onPriceTaxChange={onPriceTaxChange}
                                    onDelete={onDelete}
                                    onDiscount={onDiscount}
                                    onColumnChangeEvent={onColumnChangeEvent}
                                    discount_list={
                                      symbol === ""
                                        ? [{ label: "%", value: "percentage" }]
                                        : discount_list
                                    }
                                    symbol={symbol}
                                  />
                                );
                              }}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
        <div>
          <button
            className={`btn btn-white d-flex align-items-center mt-2`}
            onClick={() => onAdd(type)}
            type="button"
          >
            <i className="feather feather-plus fs-18 lh-24 mr-2" />
            {Lang.get("Add")}
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
