import { useForm, Controller } from "react-hook-form";
import { Customer } from "../types/customers";
import styled from "styled-components";
import { FooterActions } from "./FooterActions";
import { Button } from "./Button";

const FormControl = styled.div`
  display: flex;
  gap: 16px;
  padding-bottom: 16px;
  & > label {
    min-width: 150px;
    text-align: right;
    font-weight: bold;
  }
  & > input {
    border: 1px solid var(--colors-lynch);
    border-radius: 4px;
    padding: 6px 10px 6px 10px;

    background: var(--colors-blank);
    outline-color: var(--colors-darkGray);
    outline-offset: 4px;
    outline-width: 2px;
    cursor: pointer;
    width: 300px;

    ${({ theme }) => theme.typography.bodySmallBold};
    color: var(--colors-bayoux);

    &:hover,
    &:focus,
    &:not(:placeholder-shown) {
      background-color: var(--colors-catskillWhite);
    }

    &:not(:placeholder-shown) {
      outline: none;
      color: var(--colors-darkBlue);
    }
  }
`;

interface CustomerEditFormProps {
  onSubmit: (formData: Customer) => void;
  onCancel: () => void;
  customer: Customer;
}

const CustomerEditForm: React.FC<CustomerEditFormProps> = ({
  onSubmit,
  onCancel,
  customer,
}) => {
  const { control, handleSubmit } = useForm({
    defaultValues: customer, // Pre-fill the form with customer data
  });

  return (
    <form role="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <label>Company name:</label>
        <Controller
          name="company"
          control={control}
          render={({ field }) => <input {...field} />}
        />
      </FormControl>
      <FormControl>
        <label>Industry:</label>
        <Controller
          name="industry"
          control={control}
          render={({ field }) => <input {...field} />}
        />
      </FormControl>
      <FormControl>
        <label>Status:</label>
        <div>
          <label>
            <Controller
              name="isActive"
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <input
                  type="radio"
                  {...field}
                  value={"true"}
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                />
              )}
            />
            Active
          </label>
          <label>
            <Controller
              name="isActive"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <input
                  type="radio"
                  {...field}
                  value={"false"}
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                />
              )}
            />
            Inactive
          </label>
        </div>
      </FormControl>
      <FormControl>
        <label>About:</label>
        <Controller
          name="about"
          control={control}
          render={({ field }) => <input {...field} />}
        />
      </FormControl>
      <FooterActions>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </FooterActions>
    </form>
  );
};

export default CustomerEditForm;
