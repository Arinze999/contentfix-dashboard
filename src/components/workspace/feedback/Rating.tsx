'use client';
import ValidatingFormSubmitButton from '@/components/buttons/ValidatingFormSubmitButton';
import CustomRating from '@/components/CustomRating/CustomRating';
import { FormComponent } from '@/components/form/FormComponent';
import { TextInputField } from '@/components/form/FormField';
import { useUpdateRating } from '@/hooks/user/useUpdateRating';
import {
  RatingsDataType,
  RatingsSchema,
  ratingsValues,
} from '@/models/user/ratings.model';
import { selectRating } from '@/redux/slices/ratingSlice';
import { useAppSelector } from '@/redux/store';
import { calculateTimeAgo } from '@/utils/utils';
import React from 'react';

const Rating = () => {
  const { updateRating, loading } = useUpdateRating();

  const rating = useAppSelector(selectRating);

  console.log(rating);

  let dynamicInitialValues = ratingsValues;

  if (rating.info && rating.level) {
    dynamicInitialValues = {
      info: rating.info,
      ratings: rating.level,
    };
  }

  const handleSubmit = (values: RatingsDataType) => {
    updateRating(values);
  };

  return (
    <div className="p-3 md:p-4 rounded-xl bg-blue-400/10 border-blue-300/50 w-full">
      <FormComponent
        onSubmit={handleSubmit}
        initialValues={dynamicInitialValues}
        schema={RatingsSchema}
      >
        <h4>Rating</h4>
        <p className='text-sm text-gray-300'>
          Last updated:{' '}
          <span>{calculateTimeAgo(rating.ratingUpdatedAt!)}</span>
        </p>
        <CustomRating name="ratings" />
        <TextInputField name="info" placeholder="Additional Info here..." />
        <ValidatingFormSubmitButton loading={loading} disabled={loading}>
          Update
        </ValidatingFormSubmitButton>
      </FormComponent>
    </div>
  );
};

export default Rating;
