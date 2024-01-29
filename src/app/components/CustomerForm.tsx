import { useForm, Controller } from "react-hook-form";
import { Customer } from "../types/customers";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Company name:</label>
        <Controller
          name="company"
          control={control}
          render={({ field }) => <input {...field} />}
        />
      </div>
      <div>
        <label>Industry:</label>
        <Controller
          name="industry"
          control={control}
          render={({ field }) => <input {...field} />}
        />
      </div>
      <div>
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
      </div>
      <div>
        <label>About:</label>
        <Controller
          name="about"
          control={control}
          render={({ field }) => <input {...field} />}
        />
      </div>

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default CustomerEditForm;
