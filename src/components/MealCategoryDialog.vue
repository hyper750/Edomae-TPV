<template>
    <div
        class="modal fade"
        id="mealCategory"
        tabindex="1"
        role="dialog"
        aria-labelledby="mealCategory"
        aria-hidden="true"
        @focus="() => onModalFocus()"
    >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="mealCategory">
                        {{ $t("Meal Category") }}
                    </h5>
                    <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        @click="close()"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form
                    class="needs-validation"
                    @submit.prevent="save()"
                    ref="form"
                >
                    <div class="modal-body">
                        <div class="container-fluid px-0">
                            <div class="form-group form-row">
                                <label
                                    for="enabled"
                                    class="col-form-label col-md-2 col-2"
                                >
                                    {{ $t("Enabled") }}
                                </label>
                                <div class="col-md-1 col-1">
                                    <input
                                        type="checkbox"
                                        id="enabled"
                                        @reset="true"
                                        class="form-control"
                                        v-model="enabled"
                                        @keyup.enter="save()"
                                        :disabled="isLoading"
                                    />
                                </div>
                            </div>
                            <div class="form-group form-row">
                                <label
                                    for="name"
                                    class="col-form-label col-md-2"
                                >
                                    {{ $t("Name") }}
                                </label>
                                <div class="col-md-10">
                                    <input
                                        type="text"
                                        id="name"
                                        class="form-control"
                                        v-model="name"
                                        @keyup.enter="save()"
                                        required="required"
                                        :placeholder="
                                            $t('Type meal category name...')
                                        "
                                        :disabled="isLoading"
                                    />
                                </div>
                            </div>
                            <div class="form-row form-group">
                                <label
                                    for="order"
                                    class="col-form-label col-md-2"
                                >
                                    {{ $t("Order") }}
                                </label>
                                <div class="col-md-10">
                                    <input
                                        type="number"
                                        id="order"
                                        class="form-control"
                                        v-model="order"
                                        @keyup.enter="save()"
                                        required="required"
                                        :placeholder="
                                            $t('Type meal category order...')
                                        "
                                        :disabled="isLoading"
                                    />
                                </div>
                            </div>
                            <div class="form-row form-group">
                                <label
                                    for="imatge"
                                    class="col-form-label col-md-2"
                                >
                                    {{ $t("Imatge") }}
                                </label>
                                <div class="col-md-10">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="imatge"
                                        @change="
                                            imatgeChange($event.target.files)
                                        "
                                        class="form-control"
                                        @keyup.enter="save()"
                                        :required="!mealCategory"
                                        :disabled="isLoading"
                                        :value="imatgeValueName"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer w-100">
                        <div class="row">
                            <div class="col-md-12">
                                <button
                                    type="button"
                                    class="btn btn-secondary mr-2"
                                    data-dismiss="modal"
                                    @click="close()"
                                >
                                    {{ $t("Close") }}
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    {{ $t("Save changes") }}
                                </button>
                            </div>
                        </div>
                        <div class="row w-100 mt-3" v-if="getError || success">
                            <div class="col-md-12">
                                <p
                                    v-if="getError"
                                    class="
                                        text-danger
                                        font-weight-bold
                                        text-center
                                    "
                                >
                                    {{ getError }}
                                </p>
                                <p
                                    v-if="success"
                                    class="
                                        text-success
                                        font-weight-bold
                                        text-center
                                    "
                                >
                                    {{ $t("Meal category save") }}
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from "vue";
import MealCategoryEndpoints from "../axios/api/mealCategory";

export default {
    props: {
        mealCategory: {
            type: Object,
        },
    },

    setup(props, { emit }) {
        const form = ref(null);

        const enabled = ref(true);
        const name = ref(null);
        const order = ref(null);
        const imatge = ref(null);
        const imatgeValueName = ref(null);

        // Add meal category
        const success = ref(false);
        const {
            load: createMealCategory,
            error: errorCreateMealCategory,
            isLoading: isLoadingCreateMealCategory,
        } = MealCategoryEndpoints.post();

        const {
            load: updateMealCategory,
            error: errorUpdateMealCategory,
            isLoading: isLoadingUpdateMealCategory
        } = MealCategoryEndpoints.put();

        const getError = computed(() => errorCreateMealCategory.value || errorUpdateMealCategory.value);
        const isLoading = computed(() => isLoadingCreateMealCategory.value || isLoadingUpdateMealCategory.value);

        const resetForm = () => {
            enabled.value = true;
            name.value = null;
            order.value = null;
            imatge.value = null;
        };

        const imatgeChange = (files) => {
            imatge.value = files;
        };

        const close = () => {
            resetForm();
            emit("close");
        };

        const save = async () => {
            const newMealCategory = {
                enabled: enabled.value,
                name: name.value,
                order: order.value,
                imatge: imatge.value,
            };

            if (!props.mealCategory) {
                await createMealCategory(newMealCategory);
                success.value = !errorCreateMealCategory.value;
                resetForm();
            } else {
                // Update
                await updateMealCategory(props.mealCategory.id, newMealCategory);
                success.value = !errorUpdateMealCategory.value;
            }
            emit("save");
        };

        const onModalFocus = () => {
            errorCreateMealCategory.value = null;
            errorUpdateMealCategory.value = null;
            success.value = null;

            // Update mode
            if (props.mealCategory) {
                enabled.value = props.mealCategory.enabled;
                name.value = props.mealCategory.name;
                order.value = props.mealCategory.order;
                // imatge.value = props.mealCategory.imatge;
            }
        };

        return {
            form,

            enabled,
            name,
            order,
            imatgeChange,
            imatge,

            close,
            save,

            getError,
            success,
            isLoading,

            onModalFocus,
            imatgeValueName,
        };
    },
};
</script>
