'use client';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

enum Duration {
	AUTOMATICALLY = 'automatically',
	NEVER = 'never',
	DAYS = 'days',
	WEEKS = 'weeks',
	MONTHS = 'months',
}

type DeletionTimeframe = {
	value: number;
	duration: Duration;
};

type FormFields = {
	policyName: string;
	deletionTimeframe: string;
	directoryPath: string;
	scheduleType: string;
	policyIsEnabled: boolean;
};

const Snapshot = () => {
	const [deletionTimeframe, setDeletionTimeframe] = useState<string>(Duration.NEVER);
	const [deletionFrequency, setDeletionFrequency] = useState<DeletionTimeframe>({
		value: 14,
		duration: Duration.DAYS,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [snapshotsAreLocked, setSnapshotsAreLocked] = useState(false);
	const [snapshotHour, setSnapshotHour] = useState(0);
	const [snapshotMinute, setSnapshotMinute] = useState(0);
	const [selectedDays, setSelectedDays] = useState<boolean[]>(
		new Array(8).fill(false)
	);

	const { formState: { errors }, handleSubmit, register } = useForm<FormFields>();

	useEffect(() => {
		const fetchSnapshots = async () => {
			try {
				// const response = await fetch('/api/snapshots');
				// if (!response.ok) {
				// 	throw new Error('Network response was not ok');
				// }
				// const data = await response.json();
				// setSnapshots(data);
			} catch (error) {
				console.error('Error fetching snapshots:', error);
			}
		};
		fetchSnapshots();
	}, []);

	const selectedDayOptions = [
		'Every day',
		'Sun',
		'Mon',
		'Tue',
		'Wed',
		'Thur',
		'Fri',
		'Sat',
		'Sun',
	];
	const radioOptions = [
		{ label: 'Never', value: Duration.NEVER },
		{ label: 'Automatically after', value: Duration.AUTOMATICALLY },
	];

	const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
		console.log(data);
		const atLeastOneDaySelected = selectedDays.some((day) => day);
		if (!atLeastOneDaySelected && deletionTimeframe === Duration.AUTOMATICALLY) {
			toast.error('Please select at least one day of the week for the snapshot schedule.');
			return;
		}
		setIsLoading(true);
		setIsLoading(false);
		toast.success('Snapshot policy updated successfully!');
	};
	
	return (
		<div className="bg-graphics p-4 w-full">
			<h1 className="text-2xl mb-4">Edit Snapshot Policy</h1>
			<div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div>
						<p className="mb-2">Policy Name</p>
						{errors.policyName && (
							<p className="text-red-500 text-sm mb-2">
								Policy name is required
							</p>
						)}
						<input
							type="text"
							className="bg-subform rounded-sm p-1 bg-slate-800 min-w-md md:min-w-xl lg:min-w-2xl"
							placeholder="Enter policy name"
							{...register('policyName', {
								disabled: isLoading,
								required: true,
								maxLength: 100,
							})}
						/>
					</div>
					<div className="mt-2">
						<p className="mb-2">Apply to Directory</p>
						{errors.directoryPath && (
							<p className="text-red-500 text-sm mb-2">
								Directory path is required
							</p>
						)}
						<input
							type="text"
							className="bg-subform rounded-sm p-1 bg-slate-800 min-w-md md:min-w-xl lg:min-w-2xl"
							placeholder="Enter directory path"
							{...register('directoryPath', {
								disabled: isLoading,
								required: true,
							})}
						/>
					</div>
					<div className="mt-2">
						<p className="mb-2">Run Policy on the Following Schedule</p>
						<div className="flex bg-menu min-h-80">
							<div className="ml-15 flex flex-col justify-evenly items-end">
								<p>Select Schedule Type</p>
								<p>Set to Time Zone</p>
								<p>Take a Snapshot at</p>
								<p>On the Following Day(s)</p>
								<p>Delete Each Snapshot</p>
							</div>
							<div className="ml-5 flex flex-col justify-evenly items-start">
								<select className="bg-subform box-border rounded-sm w-40 p-1" defaultValue="daily" {...register('scheduleType', { disabled: isLoading })}>
									<option value="daily">Daily</option>
									<option value="weekly">Weekly</option>
								</select>
								<p>{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
								<div>
									<input
										disabled={isLoading}
										type="number"
										value={snapshotHour.toString().padStart(2, '0')}
										min={0}
										max={24}
										onChange={(e) => {
											let value = Number(e.target.value);
											if (value > 24) value = 24;
											if (value < 0) value = 0;
											setSnapshotHour(value);
										}}
										className="bg-subform rounded-sm w-9 p-1 text-center"
									/>
									<span className="ml-1 mr-1">:</span>
									<input
										disabled={isLoading}
										type="number"
										value={snapshotMinute.toString().padStart(2, '0')}
										min={0}
										max={59}
										onChange={(e) => {
											let value = Number(e.target.value);
											if (value > 59) value = 59;
											if (value < 0) value = 0;
											setSnapshotMinute(value);
										}}
										className="bg-subform rounded-sm w-9 p-1 text-center"
									/>
								</div>
								<div className="flex">
									{selectedDayOptions.map((day, idx) => (
										<div key={idx}>
											<input
												type="checkbox"
												checked={selectedDays[idx]}
												disabled={isLoading || idx !== 0 && selectedDays[0]}
												key={day}
												onChange={() => {
													const updatedDays = [...selectedDays];
													updatedDays[idx] = !updatedDays[idx];
													setSelectedDays(updatedDays);
												}}
											/>
											<label className="ml-2 mr-5">{day}</label>
										</div>
									))}
								</div>
								<div>
									{radioOptions.map((option) => (
										<label className="mr-3" key={option.value}>
											<input
												disabled={isLoading}
												type="radio"
												name="deletionTimeframe"
												value={option.value}
												checked={deletionTimeframe === option.value}
												onChange={() => {
													setDeletionTimeframe(option.value);
													if (option.value === Duration.NEVER) {
														setSnapshotsAreLocked(false);
													}
												}}
											/>
											<span className="ml-2">{option.label}</span>
										</label>
									))}
									<input
										type="number"
										disabled={isLoading || deletionTimeframe === Duration.NEVER}
										value={deletionFrequency.value}
										min={1}
										max={99}
										onChange={(e) => {
											let value = Number(e.target.value);
											if (value > 99) value = 99;
											if (value < 1) value = 1;
											setDeletionFrequency({
												...deletionFrequency,
												value,
											});
										}}
										className="bg-subform rounded-sm w-9 p-1 text-center disabled:text-gray-500"
									/>
									<select className="bg-subform rounded-sm p-1 ml-2" defaultValue={deletionFrequency.duration} {...register('deletionTimeframe', { disabled: isLoading || deletionTimeframe === Duration.NEVER })}>
										<option value={Duration.DAYS}>Day(s)</option>
										<option value={Duration.WEEKS}>Week(s)</option>
										<option value={Duration.MONTHS}>Month(s)</option>
									</select>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-10">
						<p>Snapshot Locking</p>
						<p className="text-sm mt-1">
							Locked snapshots cannot be deleted before the deletion schedule expires.{' '}
							For this feature to be available, snapshots must be set to automatically delete.
						</p>
						<div className="mt-2">
							<input
								type="checkbox"
								checked={snapshotsAreLocked}
								disabled={isLoading || deletionTimeframe === Duration.NEVER}
								onChange={(e) => {
									setSnapshotsAreLocked(e.target.checked);
								}}
							/>
							<label className="ml-2">Enable Snapshot Locking</label>
						</div>
					</div>
					<div className="mt-10">
						<input
							type="checkbox"
							defaultChecked
							{...register('policyIsEnabled', { disabled: isLoading })}
						/>
						<label className="ml-2">Enable policy</label>
					</div>
					<button className="bg-blueberry mt-5 pt-1 pb-1 pl-4 pr-4" type="submit">Save Policy</button>
					<button className="text-(--color-blueberry) ml-5">Cancel</button>
				</form>
			</div>
		</div>
	);
};

export default Snapshot;
