import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { fetcher } from '../app/fetcher';
import { Form } from '../components/form';
import { registerSchema } from '../schemas/users';

export default function Register() {
  return (
    <div
      className={`min-h-screen mx-auto flex flex-col justify-center transition duration-200 items-center`}
    >
      <h1 className='font-black text-6xl dark:text-white'>Register</h1>
      <Form
        submit={async (body) => {
          await fetcher('PUT', '/users', body);
        }}
        components={{
          username: (p) => (
            <div className='relative' {...p}>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-gray-700'
              >
                Username
              </label>
              <input
                // name='username'
                type='text'
                {...p}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
          ),
          email: (p) => (
            <div className='relative' {...p}>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email address
              </label>
              <input
                // name='email'
                type='email'
                {...p}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
          ),
          password: (p) => (
            <div className='relative'>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <input
                // name='password'
                type='password'
                {...p}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
          ),
        }}
        schema={registerSchema}
        buttonText='Register'
      />
    </div>
  );
}
