import * as yup from 'yup';
const registerValidationSchema = yup.object().shape({
  phone: yup.number().typeError('Phone must be a number').required('Phone number is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at least less than 20 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character'
    ),
  confirmPassword: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match'),
});

export default registerValidationSchema;
