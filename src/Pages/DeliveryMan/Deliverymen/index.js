/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { MdChevronLeft, MdCheck } from 'react-icons/md';
import { Form, Input } from '@rocketseat/unform';
import { useParams } from 'react-router-dom';

import * as Yup from 'yup';
import { toast } from 'react-toastify';

import history from '~/services/history';
import api from '~/services/api';

import { Container, Topo, FormArea } from './styles';

const schema = Yup.object().shape({
  name: Yup.string().required('É obrigatório informar o nome.'),
  email: Yup.string().email().required('É obrigatório informar o e-mail.'),
});

export default function Deliverymen() {
  const { idDeliveryman } = useParams();
  const [dataForm, setDataForm] = useState({});

  useEffect(() => {
    async function load() {
      if (idDeliveryman > 0) {
        const response = await api.get(`/deliveryman/${idDeliveryman}`);
        const { name, email } = response.data[0];
        setDataForm({ name, email });
      }
    }

    load();
  }, [idDeliveryman]);

  // eslint-disable-next-line camelcase
  async function createData({ name, email }) {
    try {
      const response = await api.post('deliveryman', {
        name,
        email,
      });

      if (response.data.id > 0) {
        toast.success('Dados gravados com sucesso.');
      }
    } catch (error) {
      toast.error(
        'Não foi possível gravar as informações. Verifique seus dados.'
      );
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  }

  // eslint-disable-next-line camelcase
  async function updateData({ name, email }) {
    try {
      const response = await api.put(`deliveryman/${idDeliveryman}`, {
        name,
        email,
      });
      if (response.data.id > 0) {
        toast.success('Dados gravados com sucesso.');
      }
    } catch (error) {
      toast.error(
        'Não foi possível gravar as informações. Verifique seus dados.'
      );
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  }

  async function handleSubmit(params) {
    if (Number(idDeliveryman) === 0) {
      await createData(params);
    } else {
      await updateData(params);
    }
    history.goBack();
  }

  return (
    <Container>
      <FormArea>
        <Form schema={schema} onSubmit={handleSubmit} initialData={dataForm}>
          <Topo>
            <h2>{`${
              idDeliveryman > 0 ? 'Alteração' : 'Cadastro'
            } de entregadores`}</h2>
            <div>
              <button type="button" onClick={() => history.goBack()}>
                <MdChevronLeft size={20} />
                <span>Voltar</span>
              </button>
              <button type="submit">
                <MdCheck size={20} />
                <span>Salvar</span>
              </button>
            </div>
          </Topo>

          <div className="area-edicao">
            <label htmlFor="name">Nome</label>
            <Input name="name" type="text" />
            <label htmlFor="deliveryman_id">e-Mail</label>
            <Input name="email" type="email" />
          </div>
        </Form>
      </FormArea>
    </Container>
  );
}
