import React, { useRef } from 'react';

import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { SubmitHandler, FormHandles } from '@unform/core';

import Input from '../../components/Input';

import Logo from '../../assets/logo2.svg';

interface FormDataDTO {
  name: string;
  email: string;
  password: string;
}

interface Errors {
  [key: string]: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit: SubmitHandler<FormDataDTO> = async data => {
    formRef.current?.setErrors({});

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('O seu nome é obrigatório'),
        password: Yup.string().required('A palavra passe é obrigatória'),
        email: Yup.string()
          .email('Insira um email válido')
          .required('O email é obrigatório'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      const validationsErrors: Errors = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach(error => {
          validationsErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationsErrors);
      }
    }
  };

  return (
    <>
      <img src={Logo} alt="GoBarber" />

      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input name="name" type="text" placeholder="Nome Completo" />
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input name="password" type="text" placeholder="Sua senha secreta" />

        <button type="submit">Acessar</button>
        <Link to="/">Já tenho login</Link>
      </Form>
    </>
  );
};

export default SignUp;
