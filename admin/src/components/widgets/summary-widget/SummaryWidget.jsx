import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateRight,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import "./summaryWidget.scss";
import { CircularProgress, IconButton } from "@mui/material";

const AmountItem = (props) => {
  return (
    <div
      className={
        "summary-item " +
        (props.increased ? "increased-amount" : "decreased-amount")
      }
    >
      <FontAwesomeIcon icon={props.increased ? faChevronUp : faChevronDown} />
      {props.amount}
    </div>
  );
};

const SummaryWidget = ({
  loading = false,
  summaryItems,
  mainItemIndex,
  onReset,
}) => {
  return (
    <div className="summary-widget-container widget">
      <div className="header-container">
        <h3>{summaryItems[mainItemIndex]?.label}</h3>
        <IconButton onClick={() => onReset()}>
          <FontAwesomeIcon icon={faArrowRotateRight} />
        </IconButton>
      </div>
      <div className="content-container">
        <div className="total-users-amount">
          {loading ? (
            <CircularProgress />
          ) : (
            <p>{summaryItems[mainItemIndex]?.amount}</p>
          )}
        </div>

        <p>Processing users may not be included. Reload to update the stats.</p>
        <div className="summary-items-container">
          {summaryItems.map((item, i) => {
            return i !== mainItemIndex ? (
              <div key={i}>
                <div className="summary-item title-item">{item.label}</div>
                <AmountItem increased={item.increased} amount={item.amount} />
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default SummaryWidget;
