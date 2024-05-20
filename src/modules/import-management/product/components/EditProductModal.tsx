import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    Radio,
    RadioChangeEvent,
    Row,
    Select,
    Tooltip,
    Typography,
    UploadFile,
    UploadProps,
    notification,
    theme,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import { RULES_FORM } from '@/utils/validator';
import FormItem from 'antd/es/form/FormItem';
import { useState } from 'react';
import { checkImageExists } from '@/utils/image';
import Upload, { RcFile } from 'antd/es/upload';
import {
    CONFIG_SLUGIFY,
    DEFAULT_NAME_FILE_LIST,
    DEFAULT_STATUS_FILE_LIST,
    DEFAULT_UID_FILE_LIST,
    MAX_PAGE_SIZE_1,
    MAX_PAGE_SIZE_2,
    MAX_PAGE_SIZE_3,
    MAX_PAGE_SIZE_4,
    MIN_PAGE_SIZE,
} from '@/constants/config';
import noImage from '@/assets/images/default/no-image.png';
import ReactQuill from 'react-quill';
import { REACT_QUILL_FORMAT, REACT_QUILL_MODULES } from '@/utils/react-quill';
import slugify from 'slugify';
import { uploadFile } from '@/services/upload.service';
import {
    CACHE_PRODUCT,
    useGetByIdProduct,
    useUpdateProduct,
} from '@/loaders/product.loader';
import { queryClient } from '@/lib/react-query';
import { EditOutlined } from '@ant-design/icons';
import { useSearchBrands } from '@/loaders/brand.loader';
import { useSearchCategoriesSmall } from '@/loaders/category-small.loader';
import { useSearchSuppliers } from '@/loaders/supplier.loader';
import { useSearchCollections } from '@/loaders/collection.loader';
import { CollectionProps } from '@/models/collection';
import { SupplierProps } from '@/models/supplier';
import { BrandProps } from '@/models/brand';
import { CategorySmallProps } from '@/models/category-small';

interface Props {
    id: string;
}

const { useToken } = theme;

const EditProductModal = ({ id }: Props) => {
    const { t } = useTranslation('translation', { keyPrefix: 'import' });
    const { token } = useToken();
    const { open, close, isOpen } = useDisclosure();
    const [form] = useForm();
    const [isUpload, setIsUpload] = useState<boolean>(true);
    const [textContent, setTextContent] = useState<string>('');
    const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);

    const searchBrands = useSearchBrands({
        params: {
            pageIndex: MIN_PAGE_SIZE,
            pageSize: MAX_PAGE_SIZE_1,
            searchData: '',
        },
        enabled: isOpen,
    });

    const searchCategoriesSmall = useSearchCategoriesSmall({
        params: {
            pageIndex: MIN_PAGE_SIZE,
            pageSize: MAX_PAGE_SIZE_2,
            searchData: '',
        },
        enabled: isOpen,
    });

    const searchSuppliers = useSearchSuppliers({
        params: {
            pageIndex: MIN_PAGE_SIZE,
            pageSize: MAX_PAGE_SIZE_3,
            searchData: '',
        },
        enabled: isOpen,
    });

    const searchCollections = useSearchCollections({
        params: {
            pageIndex: MIN_PAGE_SIZE,
            pageSize: MAX_PAGE_SIZE_4,
            searchData: '',
        },
        enabled: isOpen,
    });

    const currentProduct = useGetByIdProduct({
        id,
        config: {
            onSuccess: (response) => {
                form.setFieldsValue({
                    ...response,
                    subCategory: response?.subCategory?._id,
                });
                form.setFieldValue('upload', '');
                setTextContent(response?.description);
                setFileList([
                    {
                        uid: DEFAULT_UID_FILE_LIST,
                        name: DEFAULT_NAME_FILE_LIST,
                        status: DEFAULT_STATUS_FILE_LIST,
                        url: response?.sizeGuide || noImage,
                    },
                ]);
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
        enabled: isOpen,
    });

    const updateProduct = useUpdateProduct({
        id: id,
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_PRODUCT.SEARCH]);

                notification.success({
                    message: t('product.update_success'),
                });

                handleClose?.();
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const handleOpen = () => {
        open();
    };

    const handleClose = () => {
        close();
    };

    const [fileList, setFileList] = useState<any[]>([]);

    const onChange: UploadProps['onChange'] = async ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList);
    };

    const onRemove: UploadProps['onRemove'] = async () => {
        setFileList([]);
    };

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const handleChangeUrl = (e: any) => {
        setFileList([
            {
                uid: DEFAULT_UID_FILE_LIST,
                name: DEFAULT_NAME_FILE_LIST,
                status: DEFAULT_STATUS_FILE_LIST,
                url: e?.target?.value || noImage,
            },
        ]);
    };

    const handleChangeRatio = (e: RadioChangeEvent) => {
        setIsUpload(e.target.value);

        setFileList([
            {
                uid: DEFAULT_UID_FILE_LIST,
                name: DEFAULT_NAME_FILE_LIST,
                status: DEFAULT_STATUS_FILE_LIST,
                url: currentProduct?.data?.sizeGuide || noImage,
            },
        ]);
        form.setFieldValue('sizeGuide', currentProduct?.data?.sizeGuide);
    };

    const handleAutoFillPath = (e: any) => {
        form.setFieldValue('path', slugify(e?.target?.value, CONFIG_SLUGIFY));
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                values.sizeGuide =
                    values?.sizeGuide || currentProduct?.data?.sizeGuide;

                if (isUpload && values?.upload) {
                    let url = '';
                    if (values?.upload?.fileList?.[0]) {
                        const currentFile =
                            values?.upload?.fileList?.[0].originFileObj;
                        if (currentFile) delete currentFile['uid'];
                        const formData: any = new FormData();
                        formData.append('image', currentFile);

                        setLoadingAvatar(true);
                        const result = await uploadFile(formData);
                        setLoadingAvatar(false);

                        url = result.data.url;
                    }
                    values.sizeGuide = url;
                }

                updateProduct.mutate({
                    ...values,
                    description: textContent,
                });
            })
            .catch(() => {
                notification.warning({
                    message: t('product.validate_form'),
                });
            });
    };

    return (
        <>
            <ModalRender
                customHeader={true}
                title={<Typography.Text>{t('product.update')}</Typography.Text>}
                buttonRender={
                    <Tooltip title={t('product.update')}>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            className="btn-edit"
                            onClick={handleOpen}
                        />
                    </Tooltip>
                }
                open={isOpen}
                handleCancel={handleClose}
                handleSubmit={handleSubmit}
                confirmLoading={loadingAvatar || updateProduct?.isLoading}
            >
                {currentProduct?.isLoading ? (
                    <Flex
                        align="center"
                        justify="center"
                        style={{ height: '100%' }}
                    >
                        <div
                            className="loader"
                            style={{ background: token.colorPrimary }}
                        ></div>
                    </Flex>
                ) : (
                    <Form form={form}>
                        <Row gutter={[24, 24]}>
                            <Col span={24} md={16} lg={16}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.fields.product_name')}
                                    name="productName"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'product.fields.product_name',
                                        )}
                                        onChange={handleAutoFillPath}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.fields.path')}
                                    name="path"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('product.fields.path')}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.fields.origin')}
                                    name="origin"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('product.fields.origin')}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.fields.material')}
                                    name="material"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'product.fields.material',
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.fields.style')}
                                    name="style"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('product.fields.style')}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.fields.sub_category')}
                                    name="subCategory"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Select
                                        options={searchCategoriesSmall?.data?.subCategories?.map(
                                            (
                                                subCategory: CategorySmallProps,
                                            ) => ({
                                                label: subCategory?.subCategoryName,
                                                value: subCategory?._id,
                                            }),
                                        )}
                                        placeholder={t(
                                            'product.fields.sub_category',
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.fields.brand')}
                                    name="brand"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Select
                                        options={searchBrands?.data?.brands?.map(
                                            (brand: BrandProps) => ({
                                                label: brand?.brandName,
                                                value: brand?._id,
                                            }),
                                        )}
                                        placeholder={t('product.fields.brand')}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.fields.supplier')}
                                    name="supplier"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Select
                                        options={searchSuppliers?.data?.suppliers?.map(
                                            (supplier: SupplierProps) => ({
                                                label: supplier?.supplierName,
                                                value: supplier?._id,
                                            }),
                                        )}
                                        placeholder={t(
                                            'product.fields.supplier',
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.fields.collection_info')}
                                    name="collectionInfo"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Select
                                        options={searchCollections?.data?.collections?.map(
                                            (collection: CollectionProps) => ({
                                                label: collection?.collectionName,
                                                value: collection?._id,
                                            }),
                                        )}
                                        placeholder={t(
                                            'product.fields.collection_info',
                                        )}
                                    />
                                </FormItem>
                                {!isUpload && (
                                    <Form.Item
                                        labelCol={{ span: 7 }}
                                        name={'sizeGuide'}
                                        label={
                                            <Typography.Text
                                                style={{ marginLeft: 10 }}
                                            >
                                                {t('product.url')}
                                            </Typography.Text>
                                        }
                                        rules={[
                                            {
                                                validator: async (_, value) => {
                                                    if (value) {
                                                        try {
                                                            await checkImageExists(
                                                                value,
                                                            );
                                                            return Promise.resolve();
                                                        } catch (error) {
                                                            return Promise.reject(
                                                                new Error(
                                                                    t(
                                                                        'product.image_url_invalid',
                                                                    ),
                                                                ),
                                                            );
                                                        }
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <Input
                                            onChange={handleChangeUrl}
                                            placeholder={t('product.url')}
                                        />
                                    </Form.Item>
                                )}
                                <Flex
                                    align="center"
                                    justify="end"
                                    style={{ marginBottom: 24 }}
                                >
                                    <Radio.Group
                                        onChange={handleChangeRatio}
                                        value={isUpload}
                                    >
                                        <Radio value={true}>
                                            {t('product.upload')}
                                        </Radio>
                                        <Radio value={false}>
                                            {t('product.url')}
                                        </Radio>
                                    </Radio.Group>
                                </Flex>
                            </Col>
                            <Col span={24} md={8} lg={8}>
                                <Form.Item name={'upload'}>
                                    <Upload
                                        listType="picture-circle"
                                        name="avatar"
                                        fileList={fileList}
                                        onChange={onChange}
                                        onPreview={onPreview}
                                        onRemove={onRemove}
                                        showUploadList={{
                                            // showPreviewIcon: false,
                                            showRemoveIcon: isUpload
                                                ? true
                                                : false,
                                        }}
                                        beforeUpload={() => false}
                                        accept="image/*"
                                        className="upload-container"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    >
                                        {fileList.length < 1 && '+ Upload'}
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* RICH TEXT EDITOR */}
                        <ReactQuill
                            theme="snow"
                            value={textContent}
                            onChange={setTextContent}
                            modules={REACT_QUILL_MODULES}
                            formats={REACT_QUILL_FORMAT}
                            style={{ height: 300 }}
                        />
                    </Form>
                )}
            </ModalRender>
        </>
    );
};

export default EditProductModal;
