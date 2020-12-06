import axios from 'axios';
import React from 'react';
import { Container, Row, Spinner } from 'reactstrap';
import ItemListComponent from './ItemListComponent';
import StatusIdFilterComponent from './StatusIdFilterComponent';
function PivotItemsComponent(props) {
  const [stages, setStages] = React.useState(['DA']);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState({});
  const [items, setItems] = React.useState([]);
  const handleCheck = (e) => {
    if (e.target.checked) {
      setStages(stages.concat(e.target.name));
    } else {
      setStages(stages.filter((stage) => stage !== e.target.name));
    }
  };
  const filterShipments = (e) => {
    e.preventDefault();
    fetchData();
  };
  const fetchData = async () => {
    setIsLoading(true);
    axios
      .post('/api/items', { stages })
      .then((res) => {
        setItems(res.data);
        setError({});
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.response);
        console.log(err);
      });
  };
  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
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
        <ItemListComponent items={items} />
      )}
    </>
  );
}
export default PivotItemsComponent;
