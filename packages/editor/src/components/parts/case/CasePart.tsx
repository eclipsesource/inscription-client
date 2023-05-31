import { Fieldset, Input } from '../../widgets';
import { PartProps, usePartDirty, usePartState } from '../../props';
import CustomFieldPart from '../common/customfield/CustomFieldPart';
import { useCaseData } from './useCaseData';

export function useCasePart(): PartProps {
  const { caseData, defaultData, initData, resetData } = useCaseData();
  const state = usePartState(defaultData.case, caseData.case, []);
  const dirty = usePartDirty(initData.case, caseData.case);
  return { name: 'Case', state: state, reset: { dirty, action: () => resetData() }, content: <CasePart /> };
}

const CasePart = () => {
  const { caseData, updateName, updateDescription, updateCategory, updateCustomFields } = useCaseData();

  return (
    <>
      <Fieldset label='Name' htmlFor='caseName'>
        <Input id='caseName' value={caseData.case.name} onChange={change => updateName(change)} />
      </Fieldset>
      <Fieldset label='Description' htmlFor='caseDescription'>
        <Input id='caseDescription' value={caseData.case.description} onChange={change => updateDescription(change)} />
      </Fieldset>
      <Fieldset label='Category' htmlFor='caseCategory'>
        <Input id='caseCategory' value={caseData.case.category} onChange={change => updateCategory(change)} />
      </Fieldset>
      <CustomFieldPart customFields={caseData.case.customFields} updateCustomFields={updateCustomFields} />
    </>
  );
};
