import {
    DEFAULT_NAME_FILE_LIST,
    DEFAULT_STATUS_FILE_LIST,
    DEFAULT_UID_FILE_LIST,
} from '@/constants/config';
import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import {
    Button,
    Col,
    Divider,
    Flex,
    Form,
    Input,
    Radio,
    RadioChangeEvent,
    Row,
    Space,
    Tooltip,
    Typography,
    Upload,
    notification,
    theme,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegImage } from 'react-icons/fa6';
import noImage from '@/assets/images/default/no-image.png';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { checkImageExists } from '@/utils/image';
import {
    CACHE_COLLECTION,
    useGetByIdCollection,
} from '@/loaders/collection.loader';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import classes from '../scss/gallery.module.scss';
import ConfirmRender from '@/modules/shared/modal/confirm/ConfirmRender';
import {
    useCreateCollectionImage,
    useGetByIdCollectionImage,
    useRemoveCollectionImage,
    useUpdateCollectionImage,
} from '@/loaders/collection-image.loader';
import { queryClient } from '@/lib/react-query';
import { uploadFile } from '@/services/upload.service';

interface Props {
    id: string;
}

const { useToken } = theme;
const CollectionGallery = ({ id }: Props) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });
    const { token } = useToken();
    const { open, close, isOpen } = useDisclosure();
    const [form] = useForm();
    const [isUpload, setIsUpload] = useState<boolean>(true);
    const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);
    const [idImage, setIdImage] = useState<string>('');

    const currentCollection = useGetByIdCollection({
        id,
        config: {
            onSuccess: (_) => {
                setFileList([
                    {
                        uid: DEFAULT_UID_FILE_LIST,
                        name: DEFAULT_NAME_FILE_LIST,
                        status: DEFAULT_STATUS_FILE_LIST,
                        url: noImage,
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

    const currentCollectionImage = useGetByIdCollectionImage({
        id: idImage,
        config: {
            onSuccess: (response) => {
                setFileList([
                    {
                        uid: DEFAULT_UID_FILE_LIST,
                        name: DEFAULT_NAME_FILE_LIST,
                        status: DEFAULT_STATUS_FILE_LIST,
                        url: response?.picture || noImage,
                    },
                ]);
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
        enabled: !!idImage,
    });

    const createCollectionImage = useCreateCollectionImage({
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_COLLECTION.GET_BY_ID]);

                notification.success({
                    message: t('collection.create_image_success'),
                });

                form.resetFields();
                setIdImage("");
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const updateCollectionImage = useUpdateCollectionImage({
        id: currentCollectionImage?.data?._id,
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_COLLECTION.GET_BY_ID]);

                notification.success({
                    message: t('collection.update_image_success'),
                });

                form.resetFields();
                setIdImage("");
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const deleteCollectionImage = useRemoveCollectionImage({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_COLLECTION.GET_BY_ID]);

                notification.success({
                    message: t('collection.delete_image_success'),
                });
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

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

        if(!idImage) {
            setFileList([
                {
                    uid: DEFAULT_UID_FILE_LIST,
                    name: DEFAULT_NAME_FILE_LIST,
                    status: DEFAULT_STATUS_FILE_LIST,
                    url: noImage,
                },
            ]);
    
            form.resetFields();
        } else {
            setFileList([
                {
                    uid: DEFAULT_UID_FILE_LIST,
                    name: DEFAULT_NAME_FILE_LIST,
                    status: DEFAULT_STATUS_FILE_LIST,
                    url: currentCollectionImage?.data?.picture || noImage,
                },
            ]);
            form.setFieldValue('picture', currentCollectionImage?.data?.picture);
        }
    };

    const handleOpen = () => {
        open();
    };

    const handleClose = () => {
        close();
    };

    const handleGetImage = (id: string) => {
        setIdImage(id);
    };

    const handleRefresh = () => {
        form.resetFields();
        setFileList([
            {
                uid: DEFAULT_UID_FILE_LIST,
                name: DEFAULT_NAME_FILE_LIST,
                status: DEFAULT_STATUS_FILE_LIST,
                url: noImage,
            },
        ]);
        setIdImage('');
    };

    const handleDelete = (id: string) => {
        deleteCollectionImage.mutate(id);
    };

    const handleSave = () => {
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

                if (!currentCollectionImage?.data) {
                    createCollectionImage.mutate({
                        collectionInfo: currentCollection?.data?._id,
                        picture: values.picture,
                    });
                } else {
                    updateCollectionImage.mutate({
                        ...values, 
                        collectionInfo: currentCollection?.data?._id,
                        picture: values.picture,
                    });
                }
            })
            .catch(() => {
                notification.warning({
                    message: t('collection.validate_form'),
                });
            });
    };

    return (
        <>
            <ModalRender
                customHeader={true}
                title={
                    <Typography.Text>{t('collection.gallery')}</Typography.Text>
                }
                buttonRender={
                    <Tooltip title={t('collection.gallery')}>
                        <Button
                            shape="circle"
                            icon={<FaRegImage />}
                            onClick={handleOpen}
                            className="btn-gallery"
                        />
                    </Tooltip>
                }
                open={isOpen}
                handleCancel={handleClose}
                hideFooter={true}
            >
                {currentCollection?.isLoading ? (
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
                            <Col span={24} md={24} lg={24}>
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
                            <Col span={24} md={24} lg={24}>
                                <Flex
                                    align="center"
                                    justify="space-between"
                                    style={{ marginBottom: 24 }}
                                >
                                    <Space>
                                        <Tooltip
                                            title={
                                                !currentCollectionImage?.data
                                                    ?._id
                                                    ? t(
                                                          'collection.create_image',
                                                      )
                                                    : t(
                                                          'collection.update_image',
                                                      )
                                            }
                                        >
                                            <Button
                                                loading={
                                                    loadingAvatar ||
                                                    createCollectionImage?.isLoading ||
                                                    updateCollectionImage?.isLoading
                                                }
                                                type="primary"
                                                shape="circle"
                                                icon={
                                                    currentCollectionImage?.data
                                                        ?._id ? (
                                                        <EditOutlined />
                                                    ) : (
                                                        <PlusOutlined />
                                                    )
                                                }
                                                onClick={handleSave}
                                                disabled={
                                                    (fileList?.[0]?.uid == DEFAULT_UID_FILE_LIST 
                                                    || fileList?.length == 0) && !form.getFieldValue("picture")}
                                            />
                                        </Tooltip>
                                        <Tooltip
                                            title={t('collection.refresh')}
                                        >
                                            <Button
                                                shape="circle"
                                                icon={<ReloadOutlined />}
                                                onClick={handleRefresh}
                                            />
                                        </Tooltip>
                                    </Space>
                                    <Radio.Group
                                        onChange={handleChangeRatio}
                                        value={isUpload}
                                    >
                                        <Radio value={true}>
                                            {t('collection.upload')}
                                        </Radio>
                                        <Radio value={false}>
                                            {t('collection.url')}
                                        </Radio>
                                    </Radio.Group>
                                </Flex>
                                <Divider />
                                {!isUpload && (
                                    <Form.Item
                                        name={'picture'}
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
                                                                        'collection.image_url_invalid',
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
                                            placeholder={t('collection.url')}
                                        />
                                    </Form.Item>
                                )}
                            </Col>

                            <Col span={24} md={24} lg={24}>
                                <Swiper
                                    className={classes.galleryContainer}
                                    modules={[
                                        Navigation,
                                        Pagination,
                                        Scrollbar,
                                        A11y,
                                    ]}
                                    spaceBetween={30}
                                    slidesPerView={2}
                                    pagination={{ clickable: true }}
                                >
                                    {currentCollection?.data?.collectionImages.map(
                                        (record: any, index: number) => (
                                            <SwiperSlide
                                                key={index}
                                                className={classes.gallerySlide}
                                            >
                                                <img
                                                    src={record?.picture}
                                                    className={
                                                        classes.galleryImage
                                                    }
                                                    onClick={() =>
                                                        handleGetImage(
                                                            record?._id,
                                                        )
                                                    }
                                                />
                                                <ConfirmRender
                                                    buttonRender={
                                                        <Tooltip
                                                            title={t(
                                                                'collection.delete_image',
                                                            )}
                                                        >
                                                            <Button
                                                                shape="circle"
                                                                icon={
                                                                    <DeleteOutlined />
                                                                }
                                                                className={`btn-delete ${classes.galleryDelete}`}
                                                            />
                                                        </Tooltip>
                                                    }
                                                    handleConfirm={() =>
                                                        handleDelete(
                                                            record?._id,
                                                        )
                                                    }
                                                    content={t(
                                                        'collection.confirm_delete_image',
                                                    )}
                                                    title={t(
                                                        'collection.confirm_delete_title',
                                                    )}
                                                />
                                            </SwiperSlide>
                                        ),
                                    )}
                                </Swiper>
                            </Col>
                        </Row>
                    </Form>
                )}
            </ModalRender>
        </>
    );
};

export default CollectionGallery;
