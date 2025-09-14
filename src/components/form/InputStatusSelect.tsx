import { Field, ErrorMessage } from 'formik';

export function InputStatusSelect() {
  return (
    <div className="flex flex-col gap-1 mb-5">
      <label
        htmlFor="inputStatus"
        className="text-sm"
      >
        Input status
      </label>

      <Field
        as="select"
        id="inputStatus"
        name="inputStatus"
        className="rounded-md border w-fit py-2 border-gray-300 bg-none text-sm font-light focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="idea" className='bg-white text-black'>A Post Idea</option>
        <option value="refinement" className='bg-white text-black'>Post needing some refinement</option>
      </Field>

      <p className="text-xs text-gray-500">
        Tell ContentFix what you’re giving it: a raw idea or an existing draft
        that needs polishing.
      </p>

      <ErrorMessage
        name="inputStatus"
        component="div"
        className="text-xs text-red-600"
      />
    </div>
  );
}
