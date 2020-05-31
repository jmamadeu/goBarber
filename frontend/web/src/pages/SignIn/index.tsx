import React, { useRef } from 'react';

import * as Yup from 'yup';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import { FormHandles, SubmitHandler } from '@unform/core';

import Logo from '../../assets/logo2.svg';
import Input from '../../components/Input';

interface FormData {
  name: string;
  email: string;
}

interface Errors {
  [key: string]: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit: SubmitHandler<FormData> = async data => {
    formRef.current?.setErrors({});

    try {
      const schema = Yup.object().shape({
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
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input name="password" type="text" placeholder="Sua senha secreta" />

        <button type="submit">Acessar</button>
        <Link to="/register">Criar conta gratuita</Link>
      </Form>
    </>
  );
};

export default SignIn;
