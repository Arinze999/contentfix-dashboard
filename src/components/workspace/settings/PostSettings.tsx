'use client';

import ValidatingFormSubmitButton from '@/components/buttons/ValidatingFormSubmitButton';
import { FormComponent } from '@/components/form/FormComponent';
import { TextAreaInputField } from '@/components/form/FormField';
import Info from '@/components/info/Info';
import PersonaDefaultToggle from '@/components/personas/PersonaDefaultToggle';
import { useEditPersonas } from '@/hooks/user/useEditPersonas';
import {
  PersonasFormData,
  // personasInitialValues,
  PersonasSchema,
} from '@/models/user/personaBrand.model';
import { useAppSelector } from '@/redux/store';
import Image from 'next/image';
import React from 'react';

const PostSettings = () => {
  const { editPersonas, loading: saving } = useEditPersonas();

  const personas = useAppSelector((state) => state.personas);

  const handleSubmit = (values: PersonasFormData) => {
    editPersonas(values);
  };

  return (
    <div className="p-3 md:p-4 rounded-xl bg-blue-400/10 border-blue-300/50 w-full">
      <div>
        <h3 className="text-lg mb-4">Personas</h3>

        <FormComponent
          initialValues={personas}
          schema={PersonasSchema}
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col md:flex-row">
            <div className="w-[70px] md:w-[100px] h-[70px] md:h-[100px] overflow-hidden flex-center rounded-xl relative">
              <Image
                src={'/img/person1.png'}
                alt="profileImage"
                width={100}
                height={100}
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-black/20 to-transparent z-10" />
            </div>
            <TextAreaInputField
              name="persona1.description"
              placeholder="Briefly describe a persona..."
              label="Persona 1"
              className="border-2 rounded-md border-white/10 min-h-30"
            />
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="w-[70px] md:w-[100px] h-[70px] md:h-[100px] overflow-hidden flex-center rounded-xl relative">
              <Image
                src={'/img/person2.png'}
                alt="profileImage"
                width={100}
                height={100}
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-black/20 to-transparent z-10" />
            </div>
            <TextAreaInputField
              name="persona2.description"
              placeholder="Briefly describe a persona..."
              label="Persona 2"
              className="border-2 rounded-md border-white/10"
            />
          </div>

          {/* <h3 className="text-lg">Brand Voice</h3>

          <div className="flex gap-3 flex-col">
            <div className="w-[70px] md:w-[100px] h-[70px] md:h-[100px] overflow-hidden flex-center rounded-xl relative">
              <Image
                src={'/img/speakers.png'}
                alt="profileImage"
                width={100}
                height={100}
              />
            </div>
            <TextAreaInputField
              name="brand"
              placeholder="Give your brand a voice..."
              className="border-2 rounded-md border-white/10"
            />
          </div> */}
          <div className="flex justify-end">
            <Info
              color="blue"
              text="Its best to keep details in this section here as short and descriptive as possible, for optimal and consistent results"
            />
          </div>

          <div className="flex justify-end">
            <ValidatingFormSubmitButton
              loading={saving}
              disabled={saving}
              className="w-fit"
            >
              Save
            </ValidatingFormSubmitButton>
          </div>
        </FormComponent>
        <h3 className="text-lg my-4">
          Set Default Persona <br />
          <span className="text-xs text-gray-300">{`(this will be used to enhance and contruct your posts)`}</span>
        </h3>
        <PersonaDefaultToggle className="mt-3" />
      </div>
    </div>
  );
};

export default PostSettings;
