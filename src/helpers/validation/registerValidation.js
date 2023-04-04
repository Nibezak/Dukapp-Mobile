import * as yup from 'yup';
const registerValidationSchema = yup.object().shape({
  phone: yup.number().typeError('phoneNumberType').required('phoneNumberRequired'),
  password: yup
    .string()
    .required('passwordRequired')
    .min(8, 'passwordMin')
    .max(20, 'passwordMax')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'passwordMatch'
    ),
  confirmPassword: yup.string().oneOf([yup.ref('password'), undefined], 'passwordNotMatch'),
});

export default registerValidationSchema;
