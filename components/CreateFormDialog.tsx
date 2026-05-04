"use client";

import { axiosClient } from "@/lib/api/axiosClient";
import {
  Button,
  FieldError,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextArea,
  TextField,
} from "@heroui/react";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  workspaceSlug: string;
  triggerText: string;
  onCreated?: () => void;
};

export default function CreateFormDialog({
  triggerText,
  workspaceSlug,
  onCreated,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [touched, setTouched] = useState(false);

  const [loading, setLoading] = useState(false);

  const isInvalid = touched && !name.trim();

  const handleCreate = async () => {
    if (isInvalid) return;

    try {
      setLoading(true);

      await axiosClient.post(
        "/form",
        {
          name,
          description,
          workspaceSlug,
        },
        { withCredentials: true },
      );

      setName("");
      setDescription("");
      setIsOpen(false);

      onCreated?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger */}
      <Button onPress={() => setIsOpen(true)}>{triggerText}</Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <ModalHeader className="font-bold">Create new form</ModalHeader>

            <ModalBody className="flex flex-col gap-5 p-4">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <TextField isInvalid={isInvalid}>
                  <Label htmlFor="form-name">Form name *</Label>
                  <Input
                    id="form-name"
                    placeholder="e.g. Customer Feedback"
                    value={name}
                    onBlur={() => setTouched(true)}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white dark:bg-neutral-900 border border-default-300 focus:border-primary"
                  />

                  <FieldError>Name is required</FieldError>
                </TextField>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="form-description">Description</Label>

                <TextArea
                  id="form-description"
                  placeholder="What is this form for?"
                  value={description}
                  className="bg-white dark:bg-neutral-900 border border-default-300"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onPress={() => setIsOpen(false)}>
                Cancel
              </Button>

              <Button isPending={loading} onPress={handleCreate}>
                Create
              </Button>
            </ModalFooter>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
