'use client';

import ValidatingFormSubmitButton from '@/components/buttons/ValidatingFormSubmitButton';
import { FormComponent } from '@/components/form/FormComponent';
import { TextInputField } from '@/components/form/FormField';
import Info from '@/components/info/Info';
import {
  personaBrandInitialValues,
  PersonaBrandSchema,
} from '@/models/user/personaBrand.model';
import Image from 'next/image';
import React from 'react';

const PostSettings = () => {
  const handleSubmit = () => {};

  return (
    <div className="p-3 md:p-4 rounded-xl bg-blue-400/10 border-blue-300/50 w-full">
      <div>
        <h3 className="text-lg">Personas</h3>

        <FormComponent
          initialValues={personaBrandInitialValues}
          schema={PersonaBrandSchema}
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
            </div>
            <TextInputField
              name="persona1"
              placeholder="Briefly describe a persona to tailor your posts towards..."
              label="1"
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
            </div>
            <TextInputField
              name="persona2"
              placeholder="Briefly describe a persona to tailor your posts towards..."
              label="2"
            />
          </div>

          <h3 className="text-lg">Brand Voice</h3>

          <div className="flex gap-3 flex-col md:flex-row">
            <TextInputField
              name="brand1"
              placeholder="Give your brand a voice..."
            />
            <div className="w-[70px] md:w-[100px] h-[70px] md:h-[100px] overflow-hidden flex-center rounded-xl relative md:scale-x-[-1]">
              <Image
                src={'/img/speakers.png'}
                alt="profileImage"
                width={100}
                height={100}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Info
              color="blue"
              text="Its best to keep details in this section here as short and descriptive as possible, for optimal and consistent results"
            />
          </div>

          <div className="flex justify-end">
            <ValidatingFormSubmitButton className="w-fit">
              Save
            </ValidatingFormSubmitButton>
          </div>
        </FormComponent>
      </div>
    </div>
  );
};

export default PostSettings;
