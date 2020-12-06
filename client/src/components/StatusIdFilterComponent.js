import React from 'react';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
function StatusIdFilterComponent(props) {
  const stages = props.stages;
  const onCheck = props.onCheck;
  const onSubmit = props.onSubmit;
  const handleCheck = (e) => {
    onCheck(e);
  };
  const filterShipments = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <>
      <Form onSubmit={(e) => filterShipments(e)}>
        <FormGroup check inline>
          <Input
            type="checkbox"
            name="DN"
            id="DN"
            defaultChecked={stages.some((stage) => stage === 'DN')}
            onChange={handleCheck}
            className="m-2"
          />
          <Label for="DN" check>
            Ожидает обработки
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Input
            type="checkbox"
            name="DA"
            id="DA"
            defaultChecked={stages.some((stage) => stage === 'DA')}
            onChange={handleCheck}
            className="m-2"
          />
          <Label for="DA" check>
            Комплектация заказа
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Input
            type="checkbox"
            name="DG"
            id="DG"
            defaultChecked={stages.some((stage) => stage === 'DG')}
            onChange={handleCheck}
            className="m-2"
          />
          <Label for="DG" check>
            Ожидаем приход товара
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Input
            type="checkbox"
            name="DT"
            id="DT"
            defaultChecked={stages.some((stage) => stage === 'DT')}
            onChange={handleCheck}
            className="m-2"
          />
          <Label for="DT" check>
            Ожидаем забора транспортной компанией
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Input
            type="checkbox"
            name="DS"
            id="DS"
            defaultChecked={stages.some((stage) => stage === 'DS')}
            onChange={handleCheck}
            className="m-2"
          />
          <Label for="DS" check>
            Передан в службу доставки
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Input
            type="checkbox"
            name="DF"
            id="DF"
            defaultChecked={stages.some((stage) => stage === 'DF')}
            onChange={handleCheck}
            className="m-2"
          />
          <Label for="DF" check>
            Отгружен
          </Label>
        </FormGroup>
        <Button className="m-2">Найти</Button>
      </Form>
    </>
  );
}
export default StatusIdFilterComponent;
