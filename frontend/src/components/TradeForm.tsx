import React from 'react';
import Button from './Button'
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  amount: number,
};

type TradeFormProps = {
  onSubmitForm: (value: number) => void,
  id: number
}

const TradeForm = ({ onSubmitForm, id }: TradeFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => onSubmitForm(Number(data.amount));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue={1} type="number" {...register("amount", { required: true })} className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
      {errors.amount && <span>This field is required</span>}

      <Button type="submit" label={`Open Trade (${id})`} />
    </form>
  );
}

export default TradeForm;