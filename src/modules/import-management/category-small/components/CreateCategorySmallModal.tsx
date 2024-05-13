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
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import { RULES_FORM } from '@/utils/validator';
import FormItem from 'antd/es/form/FormItem';
import { useEffect, useState } from 'react';
import { checkImageExists } from '@/utils/image';
import Upload, { RcFile } from 'antd/es/upload';
import {
    CONFIG_SLUGIFY,
    DEFAULT_NAME_FILE_LIST,
    DEFAULT_STATUS_FILE_LIST,
    DEFAULT_UID_FILE_LIST,
    MAX_PAGE_SIZE,
    MIN_PAGE_SIZE,
} from '@/constants/config';
import noImage from '@/assets/images/default/no-image.png';
import ReactQuill from 'react-quill';
import { REACT_QUILL_FORMAT, REACT_QUILL_MODULES } from '@/utils/react-quill';
import slugify from 'slugify';
import { uploadFile } from '@/services/upload.service';
import {
    CACHE_CATEGORY_SMALL,
    useCreateCategorySmall,
} from '@/loaders/category-small.loader';
import { queryClient } from '@/lib/react-query';
import { useSearchCategoriesBig } from '@/loaders/category-big.loader';
import { CategoryBigProps } from '@/models/category-big';

const CreateCategorySmallModal = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'import' });
    const { open, close, isOpen } = useDisclosure();
    const [form] = useForm();
    const [isUpload, setIsUpload] = useState<boolean>(true);
    const [textContent, setTextContent] = useState<string>('');
    const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);

    const searchCategoriesBig = useSearchCategoriesBig({
        params: {
            pageIndex: MIN_PAGE_SIZE,
            pageSize: MAX_PAGE_SIZE,
            searchData: '',
        },
    });

    const createCategorySmall = useCreateCategorySmall({
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_CATEGORY_SMALL.SEARCH]);

                notification.success({
                    message: t('category_small.create_success'),
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

    useEffect(() => {
        form.resetFields();
        setTextContent('');
        setFileList([
            {
                uid: DEFAULT_UID_FILE_LIST,
                name: DEFAULT_NAME_FILE_LIST,
                status: DEFAULT_STATUS_FILE_LIST,
                url: noImage,
            },
        ]);
    }, [isOpen]);

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
                url: noImage,
            },
        ]);

        form.setFieldValue('picture', '');
    };

    const handleAutoFillPath = (e: any) => {
        form.setFieldValue('path', slugify(e?.target?.value, CONFIG_SLUGIFY));
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                switch (isUpload) {
                    case true:
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
                        values.picture = url;
                        break;
                }

                createCategorySmall.mutate({
                    ...values,
                    description: textContent,
                });
            })
            .catch(() => {
                notification.warning({
                    message: t('category_small.validate_form'),
                });
            });
    };

    return (
        <>
            <ModalRender
                customHeader={true}
                title={
                    <Typography.Text>
                        {t('category_small.create')}
                    </Typography.Text>
                }
                buttonRender={
                    <Tooltip title={t('category_small.create')}>
                        <Button type="primary" onClick={handleOpen}>
                            {t('category_small.create')}
                        </Button>
                    </Tooltip>
                }
                open={isOpen}
                handleCancel={handleClose}
                handleSubmit={handleSubmit}
                confirmLoading={loadingAvatar || createCategorySmall?.isLoading}
            >
                <Form form={form}>
                    <Row gutter={[24, 24]}>
                        <Col span={24} md={16} lg={16}>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t(
                                    'category_small.fields.category_small_name',
                                )}
                                name="subCategoryName"
                                rules={[...RULES_FORM.required]}
                            >
                                <Input
                                    placeholder={t(
                                        'category_small.fields.category_small_name',
                                    )}
                                    onChange={handleAutoFillPath}
                                />
                            </FormItem>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t('category_small.fields.path')}
                                name="path"
                                rules={[...RULES_FORM.required]}
                            >
                                <Input
                                    placeholder={t(
                                        'category_small.fields.path',
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t(
                                    'category_small.fields.category_big_name',
                                )}
                                name="category"
                                rules={[...RULES_FORM.required]}
                            >
                                <Select
                                    options={searchCategoriesBig?.data?.categories?.map(
                                        (category: CategoryBigProps) => ({
                                            label: category?.categoryName,
                                            value: category?._id,
                                        }),
                                    )}
                                    placeholder={t(
                                        'category_small.fields.category_big_name',
                                    )}
                                />
                            </FormItem>
                            {!isUpload && (
                                <Form.Item
                                    labelCol={{ span: 7 }}
                                    name={'picture'}
                                    label={
                                        <Typography.Text
                                            style={{ marginLeft: 10 }}
                                        >
                                            {t('category_small.url')}
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
                                                                    'category_small.image_url_invalid',
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
                                        placeholder={t('category_small.url')}
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
                                        {t('category_small.upload')}
                                    </Radio>
                                    <Radio value={false}>
                                        {t('category_small.url')}
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
                                        showRemoveIcon: isUpload ? true : false,
                                    }}
                                    beforeUpload={() => false}
                                    accept="image/*"
                                    className="upload-container"
                                    style={{ width: '100%', height: '100%' }}
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
            </ModalRender>
        </>
    );
};

export default CreateCategorySmallModal;
