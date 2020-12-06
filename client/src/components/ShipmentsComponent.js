import axios from 'axios';
import React from 'react';
import { Spinner, Row } from 'reactstrap';
import ShipmentListComponent from './ShipmentListComponent';
import StatusIdFilterComponent from './StatusIdFilterComponent';
function ShipmentsComponent(props) {
  const [stages, setStages] = React.useState(['DN']);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState({});
  const handleCheck = (e) => {
    if (e.target.checked) {
      setStages(stages.concat(e.target.name));
    } else {
      setStages(stages.filter((stage) => stage !== e.target.name));
    }
  };
  const filterShipments = (e) => {
    e.preventDefault();
    if (stages.length > 0) {
      fetchData();
    } else {
      setShipments([]);
    }
  };
  const [shipments, setShipments] = React.useState([]);
  const fetchData = async () => {
    setIsLoading(true);
    axios
      .post('/api/shipment', { stages })
      .then((res) => {
        let data = res.data;
        data.sort((a, b) =>
          a.dateAllowDelivery > b.dateAllowDelivery ? 1 : -1
        );
        setShipments(() => data);
        setError({});
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response);
        setIsLoading(false);
      });
  };
  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <StatusIdFilterComponent
        onCheck={handleCheck}
        onSubmit={filterShipments}
        stages={stages}
      />
      {isLoading ? (
        <Row className="h-100 align-items-center justify-content-center">
          <Spinner></Spinner>
        </Row>
      ) : error.data ? (
        <div className="alert alert-danger">{error.data}</div>
      ) : (
        <ShipmentListComponent
          shipments={shipments}
          setShipments={setShipments}
        />
      )}
    </div>
  );
}
export default ShipmentsComponent;
