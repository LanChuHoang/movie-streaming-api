import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateRight,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import "./summaryWidget.scss";

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

const SummaryWidget = (props) => {
  return (
    <div className="summary-widget-container widget">
      <div className="header-container">
        <h3>{props.summaryItems[props.mainItemIndex]?.label}</h3>
        <FontAwesomeIcon
          icon={faArrowRotateRight}
          onClick={() => props.onReset()}
        />
      </div>
      <div className="content-container">
        <p className="total-users-amount">
          {props.summaryItems[props.mainItemIndex]?.amount}
        </p>
        <p>Processing users may not be included. Reload to update the stats.</p>
        <div className="summary-items-container">
          {props.summaryItems.map((item, i) => {
            return i !== props.mainItemIndex ? (
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
