type Province = {
	province_id: string;
	province_name: string;
	province_type: string;
};

type District = {
	district_id: string;
	district_name: string;
	district_type: string;
	lat: string | null;
	lng: string | null;
} & Pick<Province, "province_id">;

export { type Province, type District };
