import { useState } from 'react';
import toast from 'react-hot-toast';
import { categoriesApi } from '../api/categories.api.js';
import CategoryForm from '../components/categories/CategoryForm.jsx';
import CategoryList from '../components/categories/CategoryList.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import Icon from '../components/common/Icon.jsx';
import Loader from '../components/common/Loader.jsx';
import Modal from '../components/common/Modal.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../constants/categories.js';
import { TYPE_OPTIONS, TRANSACTION_TYPES } from '../constants/transactions.js';
import { useCategories } from '../hooks/useCategories.js';
import { useConfirmAction } from '../hooks/useConfirmAction.js';

const newCategoryValues = () => ({
  name: '',
  type: TRANSACTION_TYPES.EXPENSE,
  icon: CATEGORY_ICONS.at(-1),
  color: CATEGORY_COLORS[0],
});

const toFormValues = ({ name, type, icon, color }) => ({ name, type, icon, color });

export default function CategoriesPage() {
  const { categories, error, isLoading, reload } = useCategories();

  // null = closed, { category: null } = create, { category } = edit
  const [editor, setEditor] = useState(null);
  const deletion = useConfirmAction((category) => categoriesApi.remove(category._id), {
    successMessage: 'Category deleted',
    onSuccess: reload,
  });

  const editing = editor?.category;
  const closeEditor = () => setEditor(null);

  const handleSave = async (values) => {
    if (editing) await categoriesApi.update(editing._id, values);
    else await categoriesApi.create(values);
    toast.success(editing ? 'Category updated' : 'Category created');
    closeEditor();
    reload();
  };

  const renderLists = () => {
    if (error) return <ErrorState error={error} onRetry={reload} />;
    if (isLoading && !categories.length) return <Loader />;

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {TYPE_OPTIONS.map(({ value, label }) => (
          <Card key={value} title={`${label} categories`}>
            <CategoryList
              categories={categories.filter((c) => c.type === value)}
              onEdit={(category) => setEditor({ category })}
              onDelete={deletion.request}
            />
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Categories"
        description="Default categories are shared by everyone; add your own for anything else."
        actions={
          <Button onClick={() => setEditor({ category: null })}>
            <Icon name="plus" className="size-4" />
            New category
          </Button>
        }
      />

      {renderLists()}

      <Modal
        isOpen={Boolean(editor)}
        title={editing ? 'Edit category' : 'New category'}
        onClose={closeEditor}
      >
        <CategoryForm
          key={editing?._id ?? 'new'}
          defaultValues={editing ? toFormValues(editing) : newCategoryValues()}
          isEdit={Boolean(editing)}
          onSubmit={handleSave}
          onCancel={closeEditor}
        />
      </Modal>

      <ConfirmModal
        isOpen={deletion.isOpen}
        title="Delete category?"
        message={`"${deletion.target?.name ?? ''}" will be deleted along with its budgets. Categories that are used by transactions cannot be deleted.`}
        confirmLabel="Delete"
        isLoading={deletion.isPending}
        onConfirm={deletion.confirm}
        onCancel={deletion.cancel}
      />
    </>
  );
}
